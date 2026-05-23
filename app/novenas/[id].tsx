import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/theme/colors';
import { useNovena } from '../../src/hooks/useNovena';
import { NovenaProgressBar } from '../../src/components/NovenaProgressBar';

// ─── ORACIONES COMUNES ─────────────────────────────────────────
const PRAYERS = {
  signoCruz: 'En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.',

  actoContricion:
    'Señor mío Jesucristo, Dios y Hombre verdadero, me pesa de todo corazón haber pecado, porque he merecido el infierno y perdido el cielo. Sobre todo, porque te ofendí a ti, que eres tan bueno y que tanto me amas, y a quien yo quiero amar sobre todas las cosas. Propongo firmemente, con tu gracia, enmendarme y alejarme de las ocasiones de pecado. Confío me perdonarás por tu infinita misericordia. Amén.',

  padreNuestro:
    'Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.',

  aveMaria:
    'Dios te salve, María, llena eres de gracia; el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.',

  gloria:
    'Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.',

  salveRegina:
    'Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra; Dios te salve. A ti llamamos los desterrados hijos de Eva; a ti suspiramos, gimiendo y llorando en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro, muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh, clementísima, oh piadosa, oh dulce Virgen María! Ruega por nosotros, Santa Madre de Dios, para que seamos dignos de alcanzar las promesas de nuestro Señor Jesucristo. Amén.',

  ofrenda:
    'Señor Dios todopoderoso, te ofrezco esta novena con todo mi corazón. Acepta mis oraciones, mis sacrificios y mis buenas intenciones. Te pido que escuches mi petición si es conforme a tu santa voluntad, y que me concedas la gracia de aceptar con paz tu respuesta. Por Jesucristo, nuestro Señor. Amén.',
};

// ─── INVOCACIONES POR SANTO ────────────────────────────────────
const SAINT_INVOCATIONS: Record<string, { opening: string; litany: string; closing: string }> = {
  san_jose: {
    opening: 'Oh glorioso Patriarca San José, escogido por Dios para ser el esposo de la Santísima Virgen María, padre adoptivo de Jesús y protector de la Santa Iglesia, te invoco con especial devoción en esta novena. Tú que fuiste fiel en todo momento a la voluntad divina, intercede por mí ante el trono de Dios.',
    litany: 'San José, esposo de María, ruega por nosotros.\nSan José, padre adoptivo de Jesús, ruega por nosotros.\nSan José, custodio del Redentor, ruega por nosotros.\nSan José, hombre justo, ruega por nosotros.\nSan José, modelo de trabajadores, ruega por nosotros.\nSan José, gloria de la vida doméstica, ruega por nosotros.\nSan José, guardián de las vírgenes, ruega por nosotros.\nSan José, sostén de las familias, ruega por nosotros.\nSan José, consuelo de los afligidos, ruega por nosotros.\nSan José, esperanza de los enfermos, ruega por nosotros.\nSan José, patrono de los moribundos, ruega por nosotros.\nSan José, terror de los demonios, ruega por nosotros.\nSan José, protector de la Santa Iglesia, ruega por nosotros.',
    closing: 'A ti, bienaventurado San José, acudimos en nuestra tribulación, y después de implorar el auxilio de tu santísima Esposa, solicitamos también confiadamente tu patrocinio. Por aquel afecto de caridad que te unió con la Inmaculada Virgen Madre de Dios, y por el paterno amor con que abrazaste al Niño Jesús, humildemente te suplicamos que vuelvas tus ojos a la herencia que Jesucristo conquistó con su sangre, y nos asistas en nuestras necesidades con tu poder y auxilio. Amén.',
  },
  san_judas_tadeo: {
    opening: 'Oh glorioso Apóstol San Judas Tadeo, siervo fiel y amigo de Jesús, tú que eres el patrono de los casos difíciles y desesperados, vengo a ti con humildad y confianza. Tú que gozaste de la cercanía de nuestro Salvador y que diste tu vida por la fe, mira con compasión mi necesidad.',
    litany: 'San Judas Tadeo, apóstol de Cristo, ruega por nosotros.\nSan Judas Tadeo, pariente de Jesús, ruega por nosotros.\nSan Judas Tadeo, predicador del Evangelio, ruega por nosotros.\nSan Judas Tadeo, mártir por la fe, ruega por nosotros.\nSan Judas Tadeo, intercesor poderoso, ruega por nosotros.\nSan Judas Tadeo, patrono de las causas difíciles, ruega por nosotros.\nSan Judas Tadeo, esperanza de los desesperados, ruega por nosotros.\nSan Judas Tadeo, consuelo de los afligidos, ruega por nosotros.\nSan Judas Tadeo, luz en la oscuridad, ruega por nosotros.\nSan Judas Tadeo, socorro en las tribulaciones, ruega por nosotros.',
    closing: 'Oh glorioso San Judas Tadeo, que nunca abandonas a quienes acuden a ti, escucha esta humilde oración. Preséntala ante Nuestro Señor Jesucristo y alcánzame la gracia que tanto necesito. Que por tu intercesión y la misericordia de Dios, vea cumplida mi petición si es para la mayor gloria de Dios y el bien de mi alma. Amén.',
  },
};

// Invocación genérica para santos sin contenido específico
const DEFAULT_INVOCATION = {
  opening: '',
  litany: '',
  closing: '',
};

function getSaintInvocation(novenaId: string, saint: string) {
  const specific = SAINT_INVOCATIONS[novenaId];
  if (specific) return specific;
  return {
    opening: `Oh glorioso/a ${saint}, siervo/a fiel de Dios, acudo a ti con fe y confianza en esta novena. Tú que viviste una vida de santidad y entrega, intercede por mí ante Nuestro Señor. Presenta mis necesidades y mi petición ante el trono de la gracia divina.`,
    litany: `${saint}, modelo de fe, ruega por nosotros.\n${saint}, ejemplo de esperanza, ruega por nosotros.\n${saint}, testimonio de caridad, ruega por nosotros.\n${saint}, siervo/a humilde de Dios, ruega por nosotros.\n${saint}, intercesor/a ante el Señor, ruega por nosotros.\n${saint}, protector/a de los que te invocan, ruega por nosotros.\n${saint}, guía en el camino de la santidad, ruega por nosotros.\n${saint}, consuelo en la tribulación, ruega por nosotros.`,
    closing: `Oh ${saint}, al concluir esta oración del día, te suplico que lleves mi petición ante Nuestro Señor Jesucristo. Confío en tu poderosa intercesión y en la infinita misericordia de Dios. Que se haga su santa voluntad. Amén.`,
  };
}

// ─── MEDITACIONES BREVES POR TEMA ─────────────────────────────
const MEDITATIONS: Record<string, string> = {
  obediencia: 'La obediencia a la voluntad de Dios es el fundamento de toda santidad. No se trata de una sumisión ciega, sino de un acto de amor y confianza en quien nos conoce mejor que nosotros mismos. Reflexiona: ¿en qué áreas de tu vida te cuesta obedecer la voluntad de Dios?',
  justicia: 'Ser justo no es solo cumplir la ley, sino tratar a cada persona con la dignidad que merece como hijo de Dios. La justicia cristiana va más allá de la equidad humana: incluye la misericordia, la compasión y el perdón.',
  familia: 'La familia es la primera escuela de santidad. En el hogar aprendemos a amar, a perdonar, a servir y a crecer en la fe. Encomienda a tu familia al Señor y pide la gracia de ser instrumento de su paz en tu hogar.',
  trabajo: 'El trabajo, cualquiera que sea, es una oportunidad de santificación cuando se ofrece a Dios. Cada tarea hecha con amor y dedicación se convierte en una oración.',
  silencio: 'En el silencio interior encontramos la voz de Dios. En un mundo lleno de ruido y distracciones, el silencio es un regalo que nos permite escuchar al Señor que habla al corazón.',
  fe: 'La fe es creer sin ver, confiar sin comprender plenamente. Es un don de Dios que debemos cultivar con la oración, los sacramentos y la lectura de la Palabra.',
  vocacion: 'Cada persona tiene una vocación única, un llamado de Dios que da sentido a su vida. Descubrir y vivir tu vocación es el camino más seguro hacia la santidad y la felicidad verdadera.',
  muerte: 'La muerte no es el final, sino el paso a la vida eterna. Los santos nos enseñan a prepararnos para ese momento viviendo cada día en gracia de Dios, con la conciencia limpia y el corazón en paz.',
  iglesia: 'La Iglesia es el Cuerpo de Cristo en la tierra, una comunidad de fe, esperanza y caridad. Cada miembro tiene un papel que cumplir para la edificación de todo el cuerpo.',
  general: 'Detente un momento en silencio. Abre tu corazón al Señor. Piensa en la intención por la cual estás haciendo esta novena y entrégala con confianza en las manos de Dios.',
};

function getMeditationForDay(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('obediencia') || t.includes('dócil')) return MEDITATIONS.obediencia;
  if (t.includes('justo') || t.includes('justicia')) return MEDITATIONS.justicia;
  if (t.includes('familia') || t.includes('hogar') || t.includes('protector')) return MEDITATIONS.familia;
  if (t.includes('trabajo') || t.includes('trabajador')) return MEDITATIONS.trabajo;
  if (t.includes('silencio') || t.includes('contempla')) return MEDITATIONS.silencio;
  if (t.includes('fe') || t.includes('creer') || t.includes('confianza')) return MEDITATIONS.fe;
  if (t.includes('vocación') || t.includes('padre adoptivo') || t.includes('misión')) return MEDITATIONS.vocacion;
  if (t.includes('muerte') || t.includes('morir') || t.includes('moribundo')) return MEDITATIONS.muerte;
  if (t.includes('iglesia') || t.includes('universal')) return MEDITATIONS.iglesia;
  return MEDITATIONS.general;
}

// ─── CONSTRUIR PASOS ──────────────────────────────────────────
interface NovenaStep {
  id: string;
  title: string;
  subtitle?: string;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  instruction?: string;
}

function cleanPrayerText(prayer: string): string {
  // Remover "Padre Nuestro, Ave María, Gloria." y la jaculatoria final que ya están como pasos separados
  return prayer
    .replace(/\n\nPadre Nuestro, Ave María, Gloria\./g, '')
    .replace(/\n\n.*ruega por nosotros\.$/g, '')
    .replace(/\n\nOración final:.*$/s, '')
    .trim();
}

function buildSteps(
  dayData: { day: number; title: string; prayer: string },
  novenaId: string,
  saint: string,
  isLastDay: boolean
): NovenaStep[] {
  const invocation = getSaintInvocation(novenaId, saint);
  const meditation = getMeditationForDay(dayData.title);
  const cleanedPrayer = cleanPrayerText(dayData.prayer);

  const steps: NovenaStep[] = [
    {
      id: 'signo_cruz',
      title: 'Señal de la Cruz',
      subtitle: 'Inicio de la oración',
      text: PRAYERS.signoCruz,
      icon: 'add-outline',
      instruction: 'Persígnate lentamente, con devoción, invocando a la Santísima Trinidad.',
    },
    {
      id: 'acto_contricion',
      title: 'Acto de Contrición',
      subtitle: 'Preparación del corazón',
      text: PRAYERS.actoContricion,
      icon: 'heart-outline',
      instruction: 'Recoge tu corazón ante Dios. Pide perdón por tus faltas y disponte a recibir su gracia.',
    },
    {
      id: 'ofrenda',
      title: 'Ofrenda de la Novena',
      subtitle: `Día ${dayData.day} de 9`,
      text: PRAYERS.ofrenda,
      icon: 'gift-outline',
      instruction: 'Ofrece esta novena al Señor con todas tus intenciones.',
    },
    {
      id: 'invocacion',
      title: `Invocación a ${saint}`,
      subtitle: 'Oración de apertura al santo',
      text: invocation.opening,
      icon: 'flame-outline',
      instruction: `Dirige tu corazón a ${saint}. Pide su intercesión con fe y humildad.`,
    },
    {
      id: 'meditacion',
      title: 'Meditación del día',
      subtitle: dayData.title,
      text: meditation,
      icon: 'leaf-outline',
      instruction: 'Lee lentamente esta reflexión. Haz una pausa para dejar que las palabras toquen tu corazón.',
    },
    {
      id: 'oracion_dia',
      title: `Oración del Día ${dayData.day}`,
      subtitle: dayData.title,
      text: cleanedPrayer,
      icon: 'book-outline',
      instruction: 'Esta es la oración propia de este día. Rézala con devoción y atención.',
    },
    {
      id: 'peticion',
      title: 'Petición Personal',
      subtitle: 'Tu intención',
      text: 'Haz una pausa en silencio y presenta tu petición personal al Señor, por intercesión de ' + saint + '.\n\nExpón con confianza lo que llevas en tu corazón. Dios te escucha y conoce tus necesidades antes de que las expreses.\n\nPermanece unos momentos en silencio...',
      icon: 'chatbubble-ellipses-outline',
      instruction: 'Este es tu momento personal. Presenta tu intención con fe y confianza.',
    },
    {
      id: 'padre_nuestro',
      title: 'Padre Nuestro',
      text: PRAYERS.padreNuestro,
      icon: 'hand-left-outline',
      instruction: 'Reza el Padre Nuestro, la oración que Jesús mismo nos enseñó.',
    },
    {
      id: 'ave_maria_1',
      title: 'Primera Ave María',
      subtitle: 'Por la intención de esta novena',
      text: PRAYERS.aveMaria,
      icon: 'flower-outline',
      instruction: 'Reza esta Ave María ofreciéndola por la intención de tu novena.',
    },
    {
      id: 'ave_maria_2',
      title: 'Segunda Ave María',
      subtitle: 'Por las almas del purgatorio',
      text: PRAYERS.aveMaria,
      icon: 'flower-outline',
      instruction: 'Reza esta Ave María por las almas del purgatorio, especialmente por tus familiares difuntos.',
    },
    {
      id: 'ave_maria_3',
      title: 'Tercera Ave María',
      subtitle: 'Por la paz del mundo',
      text: PRAYERS.aveMaria,
      icon: 'flower-outline',
      instruction: 'Reza esta Ave María por la paz en el mundo y la conversión de los pecadores.',
    },
    {
      id: 'gloria',
      title: 'Gloria al Padre',
      text: PRAYERS.gloria,
      icon: 'sunny-outline',
      instruction: 'Da gloria a la Santísima Trinidad con esta alabanza.',
    },
  ];

  // Letanías (si las tiene)
  if (invocation.litany) {
    steps.push({
      id: 'letanias',
      title: `Letanías a ${saint}`,
      subtitle: 'Invocaciones de intercesión',
      text: invocation.litany,
      icon: 'list-outline',
      instruction: 'Reza cada invocación respondiendo "ruega por nosotros" en tu corazón.',
    });
  }

  // Salve (para novenas marianas)
  const isMariana = saint.toLowerCase().includes('nuestra señora') || saint.toLowerCase().includes('virgen') || saint.toLowerCase().includes('guadalupe') || saint.toLowerCase().includes('carmen') || saint.toLowerCase().includes('fátima') || saint.toLowerCase().includes('inmaculada');
  if (isMariana) {
    steps.push({
      id: 'salve',
      title: 'Salve Regina',
      subtitle: 'Oración a la Virgen María',
      text: PRAYERS.salveRegina,
      icon: 'star-outline',
      instruction: 'Reza la Salve como tributo de amor a nuestra Madre celestial.',
    });
  }

  // Oración final
  steps.push({
    id: 'oracion_final',
    title: 'Oración Final',
    subtitle: isLastDay ? 'Conclusión de la novena' : `Intercesión a ${saint}`,
    text: isLastDay
      ? `${invocation.closing}\n\nOh ${saint}, al concluir esta novena de nueve días, te agradezco por tu intercesión y compañía espiritual. Confío plenamente en que has presentado mi petición ante el Señor. Que se haga la voluntad de Dios en mi vida. Amén.`
      : invocation.closing,
    icon: 'star-outline',
    instruction: isLastDay ? 'Con gratitud, concluye esta novena confiando en la intercesión del santo.' : 'Concluye la oración del día con confianza en la intercesión del santo.',
  });

  // Señal de la Cruz final
  steps.push({
    id: 'signo_cruz_final',
    title: 'Señal de la Cruz',
    subtitle: 'Cierre de la oración',
    text: PRAYERS.signoCruz,
    icon: 'add-outline',
    instruction: 'Concluye persignándote en el nombre del Padre, del Hijo y del Espíritu Santo.',
  });

  return steps;
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────
export default function NovenaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { novena, progress, startNovena, completeDay } = useNovena(id);
  const [viewingDay, setViewingDay] = useState<number | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [guidedMode, setGuidedMode] = useState(false);

  const dayData = viewingDay != null ? novena?.days.find((d) => d.day === viewingDay) : null;

  const steps = useMemo(() => {
    if (!dayData || !novena) return [];
    return buildSteps(dayData, novena.id, novena.saint, viewingDay === 9);
  }, [dayData, novena, viewingDay]);

  if (!novena) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.textSoft }}>Novena no encontrada</Text>
      </View>
    );
  }

  // ============ MODO GUIADO PASO A PASO ============
  if (guidedMode && dayData && steps.length > 0) {
    const step = steps[currentStepIdx];
    const isFirst = currentStepIdx === 0;
    const isLast = currentStepIdx === steps.length - 1;
    const isCompleted = progress?.completedDays.includes(viewingDay!) ?? false;

    return (
      <View style={{ flex: 1, backgroundColor: colors.cream }}>
        {/* Header */}
        <View style={{ backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => { setGuidedMode(false); setCurrentStepIdx(0); }}>
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '700' }}>
                {novena.saint} — Día {viewingDay}
              </Text>
              <Text style={{ color: colors.secondary, fontSize: 12 }}>
                {dayData.title}
              </Text>
            </View>
            <Text style={{ color: colors.secondary, fontSize: 13, fontWeight: '600' }}>
              {currentStepIdx + 1}/{steps.length}
            </Text>
          </View>
          {/* Progress bar */}
          <View style={{ flexDirection: 'row', gap: 2, marginTop: 10 }}>
            {steps.map((_, idx) => (
              <View key={idx} style={{
                flex: 1, height: 3, borderRadius: 2,
                backgroundColor: idx <= currentStepIdx ? colors.secondary : 'rgba(255,255,255,0.15)',
              }} />
            ))}
          </View>
        </View>

        {/* Contenido */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 30 }}>
          {/* Icono y título */}
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              width: 60, height: 60, borderRadius: 30, backgroundColor: '#F0E6D3',
              alignItems: 'center', justifyContent: 'center', marginBottom: 12,
            }}>
              <Ionicons name={step.icon} size={30} color={colors.primary} />
            </View>
            <Text style={{ fontSize: 22, fontWeight: '700', color: colors.primary, textAlign: 'center' }}>
              {step.title}
            </Text>
            {step.subtitle && (
              <Text style={{ fontSize: 14, color: colors.secondary, marginTop: 4, textAlign: 'center', fontStyle: 'italic' }}>
                {step.subtitle}
              </Text>
            )}
          </View>

          {/* Instrucción */}
          {step.instruction && (
            <View style={{ backgroundColor: '#F0E6D3', borderRadius: 12, padding: 14, marginBottom: 20 }}>
              <Text style={{ fontSize: 13, color: colors.primary, lineHeight: 20, textAlign: 'center', fontStyle: 'italic' }}>
                {step.instruction}
              </Text>
            </View>
          )}

          {/* Texto de la oración */}
          <Text style={{ fontSize: 18, lineHeight: 30, color: colors.textMain, textAlign: 'center' }}>
            {step.text}
          </Text>
        </ScrollView>

        {/* Navegación */}
        <View style={{
          flexDirection: 'row', paddingHorizontal: 16, paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 12),
          backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: colors.border, gap: 12,
        }}>
          <TouchableOpacity
            onPress={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
            disabled={isFirst}
            style={{
              flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center',
              backgroundColor: isFirst ? '#E0D8CE' : '#FFF',
              borderWidth: 1, borderColor: isFirst ? '#E0D8CE' : colors.primary,
            }}
          >
            <Ionicons name="arrow-back" size={22} color={isFirst ? '#A0A0A0' : colors.primary} />
          </TouchableOpacity>

          {isLast ? (
            <TouchableOpacity
              onPress={() => {
                if (!isCompleted) completeDay(viewingDay!);
                if (viewingDay === 9) {
                  Alert.alert(
                    'Novena completada',
                    `Has completado los 9 días de la novena a ${novena.saint}.\n\n¡Que tu petición sea escuchada! Que Dios te bendiga y ${novena.saint} interceda por ti.`,
                    [{ text: 'Amén', onPress: () => { setGuidedMode(false); setCurrentStepIdx(0); setViewingDay(null); router.back(); } }]
                  );
                } else {
                  Alert.alert(
                    `Día ${viewingDay} completado`,
                    `Has completado el día ${viewingDay} de la novena a ${novena.saint}.\n\nMañana continúa con el día ${viewingDay! + 1}: "${novena.days[viewingDay!]?.title}".`,
                    [{ text: 'Amén', onPress: () => { setGuidedMode(false); setCurrentStepIdx(0); setViewingDay(null); } }]
                  );
                }
              }}
              style={{
                flex: 3, paddingVertical: 14, borderRadius: 12,
                backgroundColor: colors.secondary, alignItems: 'center',
                flexDirection: 'row', justifyContent: 'center',
              }}
            >
              <Ionicons name="checkmark-circle" size={22} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700' }}>
                {viewingDay === 9 ? 'Finalizar Novena' : `Completar Día ${viewingDay}`}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setCurrentStepIdx((prev) => Math.min(steps.length - 1, prev + 1))}
              style={{
                flex: 3, paddingVertical: 14, borderRadius: 12,
                backgroundColor: colors.primary, alignItems: 'center',
                flexDirection: 'row', justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700' }}>Siguiente</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // ============ VISTA PREVIA DE UN DÍA ============
  if (dayData && viewingDay != null) {
    const isCompleted = progress?.completedDays.includes(viewingDay) ?? false;
    const previewSteps = buildSteps(dayData, novena.id, novena.saint, viewingDay === 9);

    return (
      <View style={{ flex: 1, backgroundColor: colors.cream }}>
        <ScrollView style={{ flex: 1, padding: 20 }} contentContainerStyle={{ paddingBottom: 100 }}>
          <TouchableOpacity
            onPress={() => setViewingDay(null)}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
            <Text style={{ marginLeft: 8, color: colors.primary, fontWeight: '600' }}>Volver</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.secondary }}>
              Día {dayData.day} de 9
            </Text>
            {isCompleted && (
              <View style={{ marginLeft: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                <Ionicons name="checkmark-circle" size={14} color={colors.greenHope} />
                <Text style={{ marginLeft: 4, fontSize: 11, color: colors.greenHope, fontWeight: '600' }}>Completado</Text>
              </View>
            )}
          </View>
          <Text style={{ fontSize: 22, fontWeight: '700', color: colors.primary, marginBottom: 20 }}>
            {dayData.title}
          </Text>

          {/* Estructura */}
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.primary, marginBottom: 12 }}>
            Estructura de la oración ({previewSteps.length} pasos)
          </Text>
          {previewSteps.map((step, idx) => (
            <View key={step.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View style={{
                width: 28, height: 28, borderRadius: 14, backgroundColor: '#F0E6D3',
                alignItems: 'center', justifyContent: 'center', marginRight: 12,
              }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary }}>{idx + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textMain }}>{step.title}</Text>
                {step.subtitle && (
                  <Text style={{ fontSize: 12, color: colors.textSoft }}>{step.subtitle}</Text>
                )}
              </View>
              <Ionicons name={step.icon} size={18} color={colors.textSoft} />
            </View>
          ))}
        </ScrollView>

        <View style={{
          paddingHorizontal: 16, paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 12),
          backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: colors.border,
        }}>
          <TouchableOpacity
            onPress={() => { setCurrentStepIdx(0); setGuidedMode(true); }}
            style={{
              backgroundColor: isCompleted ? colors.primary : colors.secondary,
              borderRadius: 14, paddingVertical: 16, alignItems: 'center',
              flexDirection: 'row', justifyContent: 'center',
            }}
          >
            <Ionicons name={isCompleted ? 'refresh' : 'play'} size={22} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '700' }}>
              {isCompleted ? 'Rezar de nuevo' : 'Iniciar guía paso a paso'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ============ VISTA PRINCIPAL ============
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.cream }}>
      <View style={{ padding: 20, backgroundColor: colors.primary }}>
        <Text style={{ fontSize: 26, fontWeight: '700', color: '#FFF' }}>{novena.saint}</Text>
        <Text style={{ fontSize: 14, color: colors.secondary, marginTop: 4 }}>Festividad: {novena.feast_day}</Text>
        <Text style={{ fontSize: 14, color: '#C0B0D0', marginTop: 2 }}>Intención: {novena.intention}</Text>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 15, lineHeight: 24, color: colors.textMain }}>{novena.description}</Text>
      </View>

      {progress && <NovenaProgressBar currentDay={progress.currentDay} completedDays={progress.completedDays} />}

      {!progress && (
        <TouchableOpacity
          onPress={() => startNovena(novena.id)}
          style={{
            marginHorizontal: 16, marginVertical: 16, backgroundColor: colors.secondary,
            borderRadius: 14, paddingVertical: 16, alignItems: 'center',
            flexDirection: 'row', justifyContent: 'center',
          }}
        >
          <Ionicons name="play-circle" size={24} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '700' }}>Comenzar Novena</Text>
        </TouchableOpacity>
      )}

      {progress && !progress.completedDays.includes(progress.currentDay) && progress.currentDay <= 9 && (
        <TouchableOpacity
          onPress={() => { setViewingDay(progress.currentDay); setCurrentStepIdx(0); setGuidedMode(true); }}
          style={{
            marginHorizontal: 16, marginBottom: 16, backgroundColor: colors.secondary,
            borderRadius: 14, paddingVertical: 16, paddingHorizontal: 20,
            flexDirection: 'row', alignItems: 'center',
          }}
        >
          <Ionicons name="play" size={24} color="#FFF" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '700' }}>Rezar día {progress.currentDay}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{novena.days[progress.currentDay - 1]?.title}</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#FFF" />
        </TouchableOpacity>
      )}

      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, paddingHorizontal: 16, marginTop: 8, marginBottom: 12 }}>
        Los 9 días
      </Text>
      {novena.days.map((day) => {
        const isCompleted = progress?.completedDays.includes(day.day) ?? false;
        const isCurrent = progress?.currentDay === day.day;
        return (
          <TouchableOpacity key={day.day} onPress={() => setViewingDay(day.day)}
            style={{
              marginHorizontal: 16, marginBottom: 8,
              backgroundColor: isCompleted ? '#E8F5E9' : isCurrent ? '#FFF8E1' : '#FFF',
              borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center',
              borderWidth: 1, borderColor: isCurrent ? colors.secondary : colors.border,
            }}>
            <View style={{
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: isCompleted ? colors.greenHope : isCurrent ? colors.secondary : '#E0D8CE',
              alignItems: 'center', justifyContent: 'center', marginRight: 12,
            }}>
              {isCompleted ? <Ionicons name="checkmark" size={20} color="#FFF" /> : <Text style={{ color: '#FFF', fontWeight: '700' }}>{day.day}</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textMain }}>{day.title}</Text>
              {isCurrent && !isCompleted && <Text style={{ fontSize: 12, color: colors.secondary, marginTop: 2 }}>Día actual — toca para rezar</Text>}
              {isCompleted && <Text style={{ fontSize: 12, color: colors.greenHope, marginTop: 2 }}>Completado</Text>}
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSoft} />
          </TouchableOpacity>
        );
      })}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}
