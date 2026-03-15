import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { usePreferencesStore } from '../../src/store/userPreferencesStore';
import { ThemeKey } from '../../src/theme/themes';

export default function SettingsScreen() {
  const { preferences, updatePreferences } = usePreferencesStore();

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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.cream }}>
      {/* Modules */}
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

      {/* Notifications */}
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, padding: 16, paddingBottom: 8 }}>
        Notificaciones
      </Text>
      {[
        { key: 'bible' as const, name: 'Textos bíblicos', icon: 'book' as const },
        { key: 'stoic' as const, name: 'Citas estoicas', icon: 'library' as const },
        { key: 'prayer' as const, name: 'Recordatorios de oración', icon: 'hand-left' as const },
        { key: 'torah' as const, name: 'Textos del Torá', icon: 'leaf' as const },
      ].map((notif) => (
        <View
          key={notif.key}
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
            <Ionicons name={notif.icon} size={20} color={colors.primary} style={{ marginRight: 10 }} />
            <Text style={{ fontSize: 15, color: colors.textMain }}>{notif.name}</Text>
          </View>
          <Switch
            value={preferences.notifications[notif.key].enabled}
            onValueChange={(val) =>
              updatePreferences({
                notifications: {
                  ...preferences.notifications,
                  [notif.key]: { ...preferences.notifications[notif.key], enabled: val },
                },
              })
            }
            trackColor={{ false: '#D0D0D0', true: colors.primaryLight }}
            thumbColor={preferences.notifications[notif.key].enabled ? colors.secondary : '#F4F4F4'}
          />
        </View>
      ))}

      {/* Theme */}
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

      {/* Font size */}
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

      {/* Bible version */}
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
