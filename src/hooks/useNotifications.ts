import { useEffect, useState, useCallback, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { usePreferencesStore } from '../store/userPreferencesStore';
import { NotificationService, ROUTINE_PRESETS } from '../services/NotificationService';
import type { NotificationPreferences } from '../store/userPreferencesStore';
import type { RoutinePreset } from '../services/NotificationService';

export function useNotifications() {
  const { preferences, updatePreferences } = usePreferencesStore();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [isScheduling, setIsScheduling] = useState(false);
  const notificationListener = useRef<Notifications.EventSubscription>(null);
  const responseListener = useRef<Notifications.EventSubscription>(null);

  // Verificar permisos al montar
  useEffect(() => {
    NotificationService.getPermissionStatus().then(setHasPermission);
  }, []);

  // Listeners para notificaciones recibidas
  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(() => {
      // La notificación fue recibida en foreground
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(() => {
      // El usuario tocó la notificación — se podría navegar a la sección correspondiente
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  // Actualizar conteo de programadas
  const refreshScheduledCount = useCallback(async () => {
    const count = await NotificationService.getScheduledCount();
    setScheduledCount(count);
  }, []);

  useEffect(() => {
    refreshScheduledCount();
  }, [refreshScheduledCount]);

  // Solicitar permisos
  const requestPermission = useCallback(async (): Promise<boolean> => {
    const granted = await NotificationService.requestPermissions();
    setHasPermission(granted);
    return granted;
  }, []);

  // Reprogramar todas las notificaciones con las preferencias actuales
  const rescheduleAll = useCallback(async () => {
    setIsScheduling(true);
    try {
      const count = await NotificationService.scheduleAllNotifications(preferences.notifications);
      setScheduledCount(count);
      return count;
    } finally {
      setIsScheduling(false);
    }
  }, [preferences.notifications]);

  // Toggle de una categoría específica
  const toggleCategory = useCallback(
    async (category: keyof NotificationPreferences, enabled: boolean) => {
      const updated: NotificationPreferences = {
        ...preferences.notifications,
        [category]: { ...preferences.notifications[category], enabled },
      };
      await updatePreferences({ notifications: updated });

      // Reprogramar
      setIsScheduling(true);
      try {
        const count = await NotificationService.scheduleAllNotifications(updated);
        setScheduledCount(count);
      } finally {
        setIsScheduling(false);
      }
    },
    [preferences.notifications, updatePreferences],
  );

  // Actualizar horarios de una categoría
  const updateTimes = useCallback(
    async (category: 'bible' | 'stoic' | 'prayer' | 'torah', times: string[]) => {
      const updated: NotificationPreferences = {
        ...preferences.notifications,
        [category]: { ...preferences.notifications[category], times },
      };
      await updatePreferences({ notifications: updated });

      setIsScheduling(true);
      try {
        const count = await NotificationService.scheduleAllNotifications(updated);
        setScheduledCount(count);
      } finally {
        setIsScheduling(false);
      }
    },
    [preferences.notifications, updatePreferences],
  );

  // Actualizar días de una categoría
  const updateDays = useCallback(
    async (category: 'bible' | 'stoic' | 'prayer' | 'torah', days: number[]) => {
      const updated: NotificationPreferences = {
        ...preferences.notifications,
        [category]: { ...preferences.notifications[category], days },
      };
      await updatePreferences({ notifications: updated });

      setIsScheduling(true);
      try {
        const count = await NotificationService.scheduleAllNotifications(updated);
        setScheduledCount(count);
      } finally {
        setIsScheduling(false);
      }
    },
    [preferences.notifications, updatePreferences],
  );

  // Aplicar un preset de rutina
  const applyPreset = useCallback(
    async (presetId: string) => {
      const preset = ROUTINE_PRESETS.find((p) => p.id === presetId);
      if (!preset) return;

      await updatePreferences({ notifications: preset.notifications });

      setIsScheduling(true);
      try {
        const count = await NotificationService.scheduleAllNotifications(preset.notifications);
        setScheduledCount(count);
      } finally {
        setIsScheduling(false);
      }
    },
    [updatePreferences],
  );

  // Cancelar todo
  const cancelAll = useCallback(async () => {
    await NotificationService.cancelAllNotifications();
    setScheduledCount(0);
  }, []);

  // Enviar notificación de prueba
  const sendTestNotification = useCallback(async (type: 'bible' | 'stoic' | 'prayer' | 'torah') => {
    let content: { title: string; body: string; source: string } | null = null;

    switch (type) {
      case 'bible':
        content = await NotificationService.getRandomBibleVerse();
        break;
      case 'stoic':
        content = await NotificationService.getRandomStoicQuote();
        break;
      case 'prayer':
        content = await NotificationService.getRandomPrayer();
        break;
      case 'torah':
        content = NotificationService.getTorahContent();
        break;
    }

    if (content) {
      const body = content.source ? `${content.body}\n— ${content.source}` : content.body;
      await NotificationService.sendImmediateNotification(content.title, body, { type });
    }
  }, []);

  return {
    hasPermission,
    scheduledCount,
    isScheduling,
    presets: ROUTINE_PRESETS as RoutinePreset[],
    requestPermission,
    rescheduleAll,
    toggleCategory,
    updateTimes,
    updateDays,
    applyPreset,
    cancelAll,
    sendTestNotification,
    refreshScheduledCount,
  };
}
