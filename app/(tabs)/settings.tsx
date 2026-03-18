import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { usePreferencesStore } from '../../src/store/userPreferencesStore';
import { useNotifications } from '../../src/hooks/useNotifications';
import { NotificationService } from '../../src/services/NotificationService';
import { ThemeKey } from '../../src/theme/themes';
import type { NotificationPreferences } from '../../src/store/userPreferencesStore';

// ─── Componente TimePicker simple ───────────────────────────────
function SimpleTimePicker({
  visible,
  initialTime,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  initialTime: string;
  onConfirm: (time: string) => void;
  onCancel: () => void;
}) {
  const parsed = NotificationService.parseTime(initialTime) || { hour: 8, minute: 0 };
  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);

  useEffect(() => {
    const p = NotificationService.parseTime(initialTime) || { hour: 8, minute: 0 };
    setHour(p.hour);
    setMinute(p.minute);
  }, [initialTime, visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 24, width: 280, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, marginBottom: 20 }}>
            Seleccionar hora
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            {/* Hora */}
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setHour((h) => (h + 1) % 24)}>
                <Ionicons name="chevron-up" size={28} color={colors.primary} />
              </TouchableOpacity>
              <Text style={{ fontSize: 36, fontWeight: '700', color: colors.textMain, width: 60, textAlign: 'center' }}>
                {hour.toString().padStart(2, '0')}
              </Text>
              <TouchableOpacity onPress={() => setHour((h) => (h - 1 + 24) % 24)}>
                <Ionicons name="chevron-down" size={28} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 36, fontWeight: '700', color: colors.textSoft, marginHorizontal: 4 }}>:</Text>
            {/* Minuto */}
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setMinute((m) => (m + 5) % 60)}>
                <Ionicons name="chevron-up" size={28} color={colors.primary} />
              </TouchableOpacity>
              <Text style={{ fontSize: 36, fontWeight: '700', color: colors.textMain, width: 60, textAlign: 'center' }}>
                {minute.toString().padStart(2, '0')}
              </Text>
              <TouchableOpacity onPress={() => setMinute((m) => (m - 5 + 60) % 60)}>
                <Ionicons name="chevron-down" size={28} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={onCancel}
              style={{ flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: 'center' }}
            >
              <Text style={{ color: colors.textSoft, fontWeight: '600' }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onConfirm(NotificationService.formatTime(hour, minute))}
              style={{ flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center' }}
            >
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Selector de días de la semana ──────────────────────────────
function DaySelector({
  selectedDays,
  onToggleDay,
}: {
  selectedDays: number[];
  onToggleDay: (day: number) => void;
}) {
  const days = [
    { num: 0, label: 'D' },
    { num: 1, label: 'L' },
    { num: 2, label: 'M' },
    { num: 3, label: 'X' },
    { num: 4, label: 'J' },
    { num: 5, label: 'V' },
    { num: 6, label: 'S' },
  ];

  return (
    <View style={{ flexDirection: 'row', gap: 4, marginTop: 8 }}>
      {days.map((d) => {
        const active = selectedDays.includes(d.num);
        return (
          <TouchableOpacity
            key={d.num}
            onPress={() => onToggleDay(d.num)}
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: active ? colors.primary : '#F0ECE6',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: active ? '#FFF' : colors.textSoft }}>
              {d.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Tarjeta de configuración por categoría ─────────────────────
function NotificationCategoryCard({
  category,
  name,
  icon,
  prefs,
  onToggle,
  onUpdateTimes,
  onUpdateDays,
  onTest,
}: {
  category: 'bible' | 'stoic' | 'prayer' | 'torah';
  name: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  prefs: { enabled: boolean; times: string[]; days: number[] };
  onToggle: (enabled: boolean) => void;
  onUpdateTimes: (times: string[]) => void;
  onUpdateDays: (days: number[]) => void;
  onTest: () => void;
}) {
  const [editingTimeIndex, setEditingTimeIndex] = useState<number | null>(null);

  const handleToggleDay = (day: number) => {
    const newDays = prefs.days.includes(day)
      ? prefs.days.filter((d) => d !== day)
      : [...prefs.days, day].sort();
    onUpdateDays(newDays);
  };

  const handleAddTime = () => {
    if (prefs.times.length >= 4) {
      Alert.alert('Límite', 'Máximo 4 horarios por categoría');
      return;
    }
    setEditingTimeIndex(prefs.times.length); // nuevo slot
  };

  const handleRemoveTime = (index: number) => {
    if (prefs.times.length <= 1) return;
    const newTimes = prefs.times.filter((_, i) => i !== index);
    onUpdateTimes(newTimes);
  };

  return (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: '#FFF',
        borderRadius: 14,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Header con toggle */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Ionicons name={icon} size={22} color={prefs.enabled ? colors.primary : colors.textSoft} />
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: prefs.enabled ? colors.textMain : colors.textSoft,
              marginLeft: 10,
            }}
          >
            {name}
          </Text>
        </View>
        <Switch
          value={prefs.enabled}
          onValueChange={onToggle}
          trackColor={{ false: '#D0D0D0', true: colors.primaryLight }}
          thumbColor={prefs.enabled ? colors.secondary : '#F4F4F4'}
        />
      </View>

      {/* Detalles (solo si está habilitado) */}
      {prefs.enabled && (
        <View style={{ marginTop: 12 }}>
          {/* Horarios */}
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSoft, marginBottom: 6 }}>
            Horarios
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            {prefs.times.map((time, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setEditingTimeIndex(index)}
                onLongPress={() => handleRemoveTime(index)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#F5F0EA',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                }}
              >
                <Ionicons name="time-outline" size={16} color={colors.primary} />
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.primary, marginLeft: 6 }}>
                  {time}
                </Text>
                {prefs.times.length > 1 && (
                  <TouchableOpacity onPress={() => handleRemoveTime(index)} style={{ marginLeft: 6 }}>
                    <Ionicons name="close-circle" size={16} color={colors.crimson} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
            {prefs.times.length < 4 && (
              <TouchableOpacity
                onPress={handleAddTime}
                style={{
                  backgroundColor: '#F5F0EA',
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderStyle: 'dashed',
                }}
              >
                <Ionicons name="add" size={18} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Días */}
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSoft, marginTop: 12, marginBottom: 2 }}>
            Días de la semana
          </Text>
          <DaySelector selectedDays={prefs.days} onToggleDay={handleToggleDay} />

          {/* Botón de prueba */}
          <TouchableOpacity
            onPress={onTest}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 12,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: '#F5F0EA',
            }}
          >
            <Ionicons name="notifications-outline" size={16} color={colors.secondary} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.secondary, marginLeft: 6 }}>
              Enviar prueba
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Time Picker Modal */}
      <SimpleTimePicker
        visible={editingTimeIndex !== null}
        initialTime={
          editingTimeIndex !== null && editingTimeIndex < prefs.times.length
            ? prefs.times[editingTimeIndex]
            : '08:00'
        }
        onConfirm={(time) => {
          if (editingTimeIndex !== null) {
            const newTimes = [...prefs.times];
            if (editingTimeIndex >= newTimes.length) {
              newTimes.push(time);
            } else {
              newTimes[editingTimeIndex] = time;
            }
            onUpdateTimes(newTimes);
          }
          setEditingTimeIndex(null);
        }}
        onCancel={() => setEditingTimeIndex(null)}
      />
    </View>
  );
}

// ─── Pantalla principal de Settings ─────────────────────────────
export default function SettingsScreen() {
  const { preferences, updatePreferences } = usePreferencesStore();
  const {
    hasPermission,
    scheduledCount,
    isScheduling,
    presets,
    requestPermission,
    toggleCategory,
    updateTimes,
    updateDays,
    applyPreset,
    sendTestNotification,
    rescheduleAll,
  } = useNotifications();

  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Solicitar permisos al entrar si no los tiene
  useEffect(() => {
    if (hasPermission === false) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  // Programar notificaciones al cargar
  useEffect(() => {
    if (hasPermission) {
      rescheduleAll();
    }
  }, [hasPermission]); // Solo al obtener permisos, no en cada cambio

  const themeOptions: { key: ThemeKey; name: string; desc: string }[] = [
    { key: 'light', name: 'Luz del Alba', desc: 'Claro y luminoso' },
    { key: 'dark', name: 'Noche Profunda', desc: 'Modo oscuro' },
    { key: 'sepia', name: 'Pergamino', desc: 'Tonos cálidos' },
  ];

  const fontSizes = [
    { key: 'small' as const, label: 'Pequeño' },
    { key: 'medium' as const, label: 'Mediano' },
    { key: 'large' as const, label: 'Grande' },
    { key: 'xlarge' as const, label: 'Muy grande' },
  ];

  const notifCategories: {
    key: 'bible' | 'stoic' | 'prayer' | 'torah';
    name: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
  }[] = [
    { key: 'bible', name: 'Textos bíblicos', icon: 'book' },
    { key: 'stoic', name: 'Citas estoicas', icon: 'library' },
    { key: 'prayer', name: 'Recordatorios de oración', icon: 'hand-left' },
    { key: 'torah', name: 'Textos del Torá', icon: 'leaf' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.cream }}>
      {/* ── Módulos activos ── */}
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, padding: 16, paddingBottom: 8 }}>
        Módulos activos
      </Text>
      {[
        { key: 'catholic' as const, name: 'Católico — Devocionario', icon: '✝️' },
        { key: 'rosary' as const, name: 'Santo Rosario', icon: '📿' },
        { key: 'bible' as const, name: 'Biblia', icon: '📖' },
        { key: 'stoic' as const, name: 'Estoicismo', icon: '🏛️' },
        { key: 'torah' as const, name: 'Torá', icon: '✡️' },
      ].map((mod) => (
        <View
          key={mod.key}
          style={{
            marginHorizontal: 16,
            marginBottom: 4,
            backgroundColor: '#FFF',
            borderRadius: 10,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, marginRight: 10 }}>{mod.icon}</Text>
            <Text style={{ fontSize: 15, color: colors.textMain }}>{mod.name}</Text>
          </View>
          <Switch
            value={preferences.enabledModules[mod.key]}
            onValueChange={(val) =>
              updatePreferences({
                enabledModules: { ...preferences.enabledModules, [mod.key]: val },
              })
            }
            trackColor={{ false: '#D0D0D0', true: colors.primaryLight }}
            thumbColor={preferences.enabledModules[mod.key] ? colors.secondary : '#F4F4F4'}
          />
        </View>
      ))}

      {/* ── Notificaciones ── */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary }}>
          Notificaciones
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {isScheduling && <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: 8 }} />}
          <View style={{ backgroundColor: colors.primaryLight, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#FFF' }}>
              {scheduledCount} programadas
            </Text>
          </View>
        </View>
      </View>

      {/* Permiso warning */}
      {hasPermission === false && (
        <TouchableOpacity
          onPress={requestPermission}
          style={{
            marginHorizontal: 16,
            marginBottom: 8,
            backgroundColor: '#FFF3E0',
            borderRadius: 10,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons name="warning" size={20} color="#E65100" />
          <Text style={{ fontSize: 13, color: '#E65100', marginLeft: 8, flex: 1 }}>
            Permisos de notificación no concedidos. Toca para activar.
          </Text>
        </TouchableOpacity>
      )}

      {/* Presets de rutinas */}
      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textSoft, paddingHorizontal: 16, marginTop: 4, marginBottom: 8 }}>
        Rutinas espirituales
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
        {presets.map((preset) => (
          <TouchableOpacity
            key={preset.id}
            onPress={() => {
              setActivePreset(preset.id);
              applyPreset(preset.id);
            }}
            style={{
              backgroundColor: activePreset === preset.id ? colors.primary : '#FFF',
              borderRadius: 12,
              padding: 14,
              marginHorizontal: 4,
              width: 160,
              borderWidth: 1,
              borderColor: activePreset === preset.id ? colors.primary : colors.border,
            }}
          >
            <Text style={{ fontSize: 22, marginBottom: 4 }}>{preset.icon}</Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: activePreset === preset.id ? '#FFF' : colors.textMain,
              }}
            >
              {preset.name}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: activePreset === preset.id ? '#C0B0D0' : colors.textSoft,
                marginTop: 4,
              }}
              numberOfLines={2}
            >
              {preset.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Categorías detalladas */}
      <View style={{ marginTop: 12 }}>
        {notifCategories.map((cat) => (
          <NotificationCategoryCard
            key={cat.key}
            category={cat.key}
            name={cat.name}
            icon={cat.icon}
            prefs={preferences.notifications[cat.key]}
            onToggle={(enabled) => toggleCategory(cat.key, enabled)}
            onUpdateTimes={(times) => updateTimes(cat.key, times)}
            onUpdateDays={(days) => updateDays(cat.key, days)}
            onTest={() => sendTestNotification(cat.key)}
          />
        ))}
      </View>

      {/* Novena toggle simple */}
      <View
        style={{
          marginHorizontal: 16,
          marginBottom: 12,
          backgroundColor: '#FFF',
          borderRadius: 14,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons
            name="flame"
            size={22}
            color={preferences.notifications.novena.enabled ? colors.crimson : colors.textSoft}
          />
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: preferences.notifications.novena.enabled ? colors.textMain : colors.textSoft,
              }}
            >
              Recordatorios de novena
            </Text>
            <Text style={{ fontSize: 12, color: colors.textSoft }}>
              Notificación diaria al iniciar una novena
            </Text>
          </View>
        </View>
        <Switch
          value={preferences.notifications.novena.enabled}
          onValueChange={(val) => toggleCategory('novena', val)}
          trackColor={{ false: '#D0D0D0', true: colors.crimson }}
          thumbColor={preferences.notifications.novena.enabled ? colors.secondary : '#F4F4F4'}
        />
      </View>

      {/* ── Apariencia ── */}
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, padding: 16, paddingBottom: 8 }}>
        Apariencia
      </Text>
      <View style={{ flexDirection: 'row', paddingHorizontal: 12, marginBottom: 16 }}>
        {themeOptions.map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => updatePreferences({ theme: t.key })}
            style={{
              flex: 1,
              margin: 4,
              backgroundColor: preferences.theme === t.key ? colors.primary : '#FFF',
              borderRadius: 12,
              padding: 14,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: preferences.theme === t.key ? colors.primary : colors.border,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: preferences.theme === t.key ? '#FFF' : colors.textMain }}>
              {t.name}
            </Text>
            <Text style={{ fontSize: 11, color: preferences.theme === t.key ? '#C0B0D0' : colors.textSoft, marginTop: 2 }}>
              {t.desc}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tamaño de fuente */}
      <Text style={{ fontSize: 16, fontWeight: '600', color: colors.primary, paddingHorizontal: 16, marginBottom: 8 }}>
        Tamaño de fuente
      </Text>
      <View style={{ flexDirection: 'row', paddingHorizontal: 12, marginBottom: 16 }}>
        {fontSizes.map((f) => (
          <TouchableOpacity
            key={f.key}
            onPress={() => updatePreferences({ fontSize: f.key })}
            style={{
              flex: 1,
              margin: 4,
              backgroundColor: preferences.fontSize === f.key ? colors.secondary : '#FFF',
              borderRadius: 10,
              paddingVertical: 10,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: preferences.fontSize === f.key ? colors.secondary : colors.border,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: preferences.fontSize === f.key ? '#FFF' : colors.textMain }}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Versión bíblica */}
      <Text style={{ fontSize: 16, fontWeight: '600', color: colors.primary, paddingHorizontal: 16, marginBottom: 8 }}>
        Versión bíblica
      </Text>
      <View style={{ flexDirection: 'row', paddingHorizontal: 12, marginBottom: 24 }}>
        {(['RVR1960', 'NVI'] as const).map((v) => (
          <TouchableOpacity
            key={v}
            onPress={() => updatePreferences({ bibleVersion: v })}
            style={{
              flex: 1,
              margin: 4,
              backgroundColor: preferences.bibleVersion === v ? colors.primary : '#FFF',
              borderRadius: 10,
              paddingVertical: 12,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: preferences.bibleVersion === v ? colors.primary : colors.border,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: preferences.bibleVersion === v ? '#FFF' : colors.textMain }}>
              {v}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* About */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 40, alignItems: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: colors.primary }}>Anima Mundi</Text>
        <Text style={{ fontSize: 13, color: colors.textSoft, marginTop: 4 }}>
          Disciplina espiritual y filosófica
        </Text>
        <Text style={{ fontSize: 12, color: colors.textSoft, marginTop: 2 }}>Versión 1.0.0</Text>
      </View>
    </ScrollView>
  );
}
