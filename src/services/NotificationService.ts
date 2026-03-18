import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getDatabase } from '../database/schema';
import type { NotificationPreferences } from '../store/userPreferencesStore';

// Tipos de notificación espiritual
export type NotificationType = 'bible' | 'stoic' | 'prayer' | 'torah' | 'novena';

export interface SpiritualNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  source?: string;
}

// Presets de rutinas espirituales
export interface RoutinePreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  notifications: NotificationPreferences;
}

export const ROUTINE_PRESETS: RoutinePreset[] = [
  {
    id: 'matutina',
    name: 'Disciplina Matutina',
    description: '6:00 Biblia — 6:30 Estoicismo — 7:00 Oración',
    icon: '🌅',
    notifications: {
      bible: { enabled: true, times: ['06:00'], days: [0, 1, 2, 3, 4, 5, 6] },
      stoic: { enabled: true, times: ['06:30'], days: [0, 1, 2, 3, 4, 5, 6] },
      prayer: { enabled: true, times: ['07:00'], days: [0, 1, 2, 3, 4, 5, 6] },
      torah: { enabled: false, times: [], days: [] },
      novena: { enabled: true },
    },
  },
  {
    id: 'mediodia',
    name: 'Pausa de Mediodía',
    description: '12:00 Ángelus — 12:15 Torá — 13:00 Salmo',
    icon: '☀️',
    notifications: {
      bible: { enabled: true, times: ['13:00'], days: [0, 1, 2, 3, 4, 5, 6] },
      stoic: { enabled: false, times: [], days: [] },
      prayer: { enabled: true, times: ['12:00'], days: [0, 1, 2, 3, 4, 5, 6] },
      torah: { enabled: true, times: ['12:15'], days: [0, 1, 2, 3, 4, 5, 6] },
      novena: { enabled: true },
    },
  },
  {
    id: 'noche',
    name: 'Noche de Paz',
    description: '18:00 Ángelus — 20:00 Séneca — 22:00 Oración',
    icon: '🌙',
    notifications: {
      bible: { enabled: false, times: [], days: [] },
      stoic: { enabled: true, times: ['20:00'], days: [0, 1, 2, 3, 4, 5, 6] },
      prayer: { enabled: true, times: ['18:00', '22:00'], days: [0, 1, 2, 3, 4, 5, 6] },
      torah: { enabled: false, times: [], days: [] },
      novena: { enabled: true },
    },
  },
  {
    id: 'filosofica',
    name: 'Inmersión Filosófica',
    description: '7:00 Marco Aurelio — 12:00 Epicteto — 19:00 Séneca',
    icon: '🏛️',
    notifications: {
      bible: { enabled: false, times: [], days: [] },
      stoic: { enabled: true, times: ['07:00', '12:00', '19:00'], days: [0, 1, 2, 3, 4, 5, 6] },
      prayer: { enabled: false, times: [], days: [] },
      torah: { enabled: false, times: [], days: [] },
      novena: { enabled: false },
    },
  },
];

// Configurar el handler de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  // ─── Permisos ───────────────────────────────────────────────

  static async requestPermissions(): Promise<boolean> {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return false;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('spiritual', {
        name: 'Espiritual',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4A2F6E',
      });
    }

    return true;
  }

  static async getPermissionStatus(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  }

  // ─── Contenido aleatorio desde BD ───────────────────────────

  static async getRandomBibleVerse(): Promise<{ title: string; body: string; source: string } | null> {
    try {
      const db = await getDatabase();
      const verse = await db.getFirstAsync<{
        book: string;
        chapter: number;
        verse: number;
        text: string;
      }>('SELECT book, chapter, verse, text FROM bible_verses ORDER BY RANDOM() LIMIT 1');
      if (!verse) return null;
      return {
        title: '📖 Palabra de Dios',
        body: verse.text,
        source: `${verse.book} ${verse.chapter}:${verse.verse}`,
      };
    } catch {
      return null;
    }
  }

  static async getRandomStoicQuote(): Promise<{ title: string; body: string; source: string } | null> {
    try {
      const db = await getDatabase();
      const quote = await db.getFirstAsync<{
        author: string;
        work: string;
        book_chapter: string;
        text: string;
      }>('SELECT author, work, book_chapter, text FROM stoic_quotes ORDER BY RANDOM() LIMIT 1');
      if (!quote) return null;

      const authorNames: Record<string, string> = {
        marco_aurelio: 'Marco Aurelio',
        epicteto: 'Epicteto',
        seneca: 'Séneca',
        musonio_rufo: 'Musonio Rufo',
        crisipo: 'Crisipo',
        zenon: 'Zenón de Citio',
      };

      return {
        title: '🏛️ Sabiduría Estoica',
        body: quote.text,
        source: `${authorNames[quote.author] || quote.author} — ${quote.work} ${quote.book_chapter}`,
      };
    } catch {
      return null;
    }
  }

  static async getRandomPrayer(): Promise<{ title: string; body: string; source: string } | null> {
    try {
      const db = await getDatabase();
      const prayer = await db.getFirstAsync<{
        name: string;
        text: string;
        category: string;
      }>('SELECT name, text, category FROM prayers ORDER BY RANDOM() LIMIT 1');
      if (!prayer) return null;

      // Truncar el texto para la notificación (máx 200 chars)
      const body = prayer.text.length > 200
        ? prayer.text.substring(0, 197) + '...'
        : prayer.text;

      return {
        title: '🙏 Momento de Oración',
        body,
        source: prayer.name,
      };
    } catch {
      return null;
    }
  }

  static getTorahContent(): { title: string; body: string; source: string } {
    // Contenido estático del Torá (hasta que se integre Sefaria API)
    const torahTexts = [
      { text: 'En el principio creó Dios los cielos y la tierra.', ref: 'Bereshit (Génesis) 1:1' },
      { text: 'Y dijo Dios: Sea la luz; y fue la luz.', ref: 'Bereshit (Génesis) 1:3' },
      { text: 'Oye, Israel: el Señor nuestro Dios, el Señor uno es.', ref: 'Devarim (Deuteronomio) 6:4' },
      { text: 'Amarás al Señor tu Dios con todo tu corazón, y con toda tu alma, y con todas tus fuerzas.', ref: 'Devarim (Deuteronomio) 6:5' },
      { text: 'Honra a tu padre y a tu madre, para que tus días se alarguen en la tierra.', ref: 'Shemot (Éxodo) 20:12' },
      { text: 'No te vengarás, ni guardarás rencor; amarás a tu prójimo como a ti mismo.', ref: 'Vayikra (Levítico) 19:18' },
      { text: 'Santos seréis, porque santo soy yo, el Señor vuestro Dios.', ref: 'Vayikra (Levítico) 19:2' },
      { text: 'El Señor te bendiga y te guarde; el Señor haga resplandecer su rostro sobre ti.', ref: 'Bamidbar (Números) 6:24-25' },
      { text: 'Y estas palabras que yo te mando hoy, estarán sobre tu corazón.', ref: 'Devarim (Deuteronomio) 6:6' },
      { text: 'Porque el Señor tu Dios es Dios misericordioso; no te dejará, ni te destruirá.', ref: 'Devarim (Deuteronomio) 4:31' },
    ];
    const today = new Date();
    const index = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % torahTexts.length;
    const selected = torahTexts[index];
    return {
      title: '✡️ Torá del Día',
      body: selected.text,
      source: selected.ref,
    };
  }

  // ─── Programación de notificaciones ──────────────────────────

  static async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  static async getScheduledCount(): Promise<number> {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    return scheduled.length;
  }

  /**
   * Programa todas las notificaciones según las preferencias del usuario.
   * Cancela las anteriores y reprograma desde cero.
   */
  static async scheduleAllNotifications(prefs: NotificationPreferences): Promise<number> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return 0;

    // Cancelar todas las existentes
    await this.cancelAllNotifications();

    let count = 0;

    // Programar por cada tipo habilitado
    if (prefs.bible.enabled) {
      count += await this.scheduleTypeNotifications('bible', prefs.bible.times, prefs.bible.days);
    }

    if (prefs.stoic.enabled) {
      count += await this.scheduleTypeNotifications('stoic', prefs.stoic.times, prefs.stoic.days);
    }

    if (prefs.prayer.enabled) {
      count += await this.scheduleTypeNotifications('prayer', prefs.prayer.times, prefs.prayer.days);
    }

    if (prefs.torah.enabled) {
      count += await this.scheduleTypeNotifications('torah', prefs.torah.times, prefs.torah.days);
    }

    return count;
  }

  /**
   * Programa notificaciones recurrentes para un tipo específico.
   * Crea una notificación semanal por cada combinación de hora + día.
   */
  private static async scheduleTypeNotifications(
    type: NotificationType,
    times: string[],
    days: number[],
  ): Promise<number> {
    let count = 0;

    const contentMap: Record<string, { title: string; body: string; subtitle?: string }> = {
      bible: { title: '📖 Palabra de Dios', body: 'Abre la app para leer tu versículo del día', subtitle: 'Biblia' },
      stoic: { title: '🏛️ Sabiduría Estoica', body: 'Tu reflexión filosófica del día te espera', subtitle: 'Estoicismo' },
      prayer: { title: '🙏 Momento de Oración', body: 'Es hora de un momento de paz y oración', subtitle: 'Oración' },
      torah: { title: '✡️ Torá del Día', body: 'Descubre la enseñanza del Torá de hoy', subtitle: 'Torá' },
    };

    const content = contentMap[type];
    if (!content) return 0;

    for (const time of times) {
      const [hourStr, minuteStr] = time.split(':');
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);

      if (isNaN(hour) || isNaN(minute)) continue;

      for (const weekday of days) {
        // expo-notifications usa 1=Domingo, 2=Lunes... 7=Sábado
        // Nuestro store usa 0=Domingo, 1=Lunes... 6=Sábado
        const expoWeekday = weekday + 1;

        await Notifications.scheduleNotificationAsync({
          content: {
            title: content.title,
            body: content.body,
            subtitle: content.subtitle,
            data: { type, time, weekday },
            ...(Platform.OS === 'android' && { channelId: 'spiritual' }),
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: expoWeekday,
            hour,
            minute,
          },
        });
        count++;
      }
    }

    return count;
  }

  // ─── Notificación inmediata (para testing / novenas) ──────────

  static async sendImmediateNotification(
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<string> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) throw new Error('Permisos de notificación no concedidos');

    return Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        ...(Platform.OS === 'android' && { channelId: 'spiritual' }),
      },
      trigger: null, // Inmediata
    });
  }

  // ─── Novena: programar recordatorio diario por N días ─────────

  static async scheduleNovenaReminder(
    novenaName: string,
    currentDay: number,
    remainingDays: number,
    hour: number = 8,
    minute: number = 0,
  ): Promise<void> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    // Cancelar recordatorios de novena anteriores
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notif of scheduled) {
      if (notif.content.data?.type === 'novena') {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
    }

    // Programar un recordatorio por cada día restante
    for (let i = 0; i < remainingDays; i++) {
      const dayNumber = currentDay + i + 1;
      if (dayNumber > 9) break;

      const triggerDate = new Date();
      triggerDate.setDate(triggerDate.getDate() + i + 1);
      triggerDate.setHours(hour, minute, 0, 0);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🕯️ Novena — ${novenaName}`,
          body: `Día ${dayNumber} de 9. Continúa tu novena hoy.`,
          data: { type: 'novena', novenaName, day: String(dayNumber) },
          ...(Platform.OS === 'android' && { channelId: 'spiritual' }),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
        },
      });
    }
  }

  // ─── Utilidades ──────────────────────────────────────────────

  static async listScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return Notifications.getAllScheduledNotificationsAsync();
  }

  static parseTime(timeStr: string): { hour: number; minute: number } | null {
    const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    const hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
    return { hour, minute };
  }

  static formatTime(hour: number, minute: number): string {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  static getDayName(day: number): string {
    const names = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return names[day] || '';
  }

  static getDayFullName(day: number): string {
    const names = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return names[day] || '';
  }
}
