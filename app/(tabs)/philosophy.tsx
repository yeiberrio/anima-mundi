import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { ContentProvider } from '../../src/services/ContentProvider';
import { QuoteDisplay } from '../../src/components/QuoteDisplay';

interface StoicQuote {
  id: number;
  author: string;
  work: string;
  book_chapter: string;
  text: string;
  theme: string;
}

type ActiveSection = 'home' | 'author' | 'glossary' | 'exercises' | 'virtues';

const authorNames: Record<string, string> = {
  marco_aurelio: 'Marco Aurelio',
  epicteto: 'Epicteto',
  seneca: 'Séneca',
  musonio_rufo: 'Musonio Rufo',
  crisipo: 'Crisipo de Solos',
  zenon: 'Zenón de Citio',
};

const authorInfo: Record<string, { years: string; desc: string; works: string }> = {
  marco_aurelio: {
    years: '121–180 d.C.',
    desc: 'Emperador romano y filósofo estoico. Sus "Meditaciones" son reflexiones escritas para sí mismo durante sus campañas militares.',
    works: 'Meditaciones (Τὰ εἰς ἑαυτόν)',
  },
  epicteto: {
    years: '50–135 d.C.',
    desc: 'Nacido esclavo, se convirtió en uno de los más grandes maestros estoicos. Su enseñanza se centra en la dicotomía del control.',
    works: 'Enquiridión (Manual), Discursos',
  },
  seneca: {
    years: '4 a.C.–65 d.C.',
    desc: 'Filósofo, estadista y tutor de Nerón. Sus cartas y ensayos son guías prácticas para la vida virtuosa.',
    works: 'Cartas a Lucilio, Sobre la brevedad de la vida, Sobre la tranquilidad del alma',
  },
  musonio_rufo: {
    years: '30–100 d.C.',
    desc: 'Conocido como el "Sócrates romano". Maestro de Epicteto, defendió la igualdad educativa entre hombres y mujeres.',
    works: 'Discursos (fragmentos conservados)',
  },
  crisipo: {
    years: '279–206 a.C.',
    desc: 'Gran sistematizador del estoicismo. Escribió más de 700 obras y consolidó la lógica y la ética estoica.',
    works: 'Fragmentos conservados',
  },
  zenon: {
    years: '334–262 a.C.',
    desc: 'Fundador del estoicismo. Enseñó en la Stoa Poikilé (Pórtico Pintado) de Atenas, de donde toma nombre la escuela.',
    works: 'Fragmentos conservados',
  },
};

const stoicGlossary = [
  { term: 'Logos', pron: 'LO-gos', meaning: 'Razón universal que gobierna el cosmos' },
  { term: 'Eudaimonia', pron: 'eu-dai-mo-NI-a', meaning: 'Florecimiento / felicidad verdadera' },
  { term: 'Arete', pron: 'a-RE-te', meaning: 'Virtud / excelencia moral' },
  { term: 'Apatheia', pron: 'a-PA-thei-a', meaning: 'Ausencia de pasiones irracionales' },
  { term: 'Ataraxia', pron: 'a-ta-RAX-ia', meaning: 'Tranquilidad del alma, serenidad' },
  { term: 'Prohairesis', pron: 'pro-HAI-re-sis', meaning: 'Facultad de elección moral' },
  { term: 'Memento Mori', pron: 'latín', meaning: 'Recuerda que morirás' },
  { term: 'Amor Fati', pron: 'latín', meaning: 'Amor al destino' },
  { term: 'Summum Bonum', pron: 'latín', meaning: 'El bien supremo (la virtud)' },
];

const exercises = [
  {
    name: 'Meditación matutina',
    latin: 'Praemeditatio Malorum',
    desc: 'Anticipa los desafíos del día. Imagina lo peor que podría pasar y prepárate mentalmente.',
    steps: [
      'Siéntate en silencio al despertar.',
      'Piensa en las dificultades que podrías enfrentar hoy.',
      'Visualiza cómo responderás con virtud ante cada una.',
      'Recuerda: muchas cosas no dependen de ti.',
      'Comienza el día con determinación y serenidad.',
    ],
  },
  {
    name: 'Revisión nocturna',
    latin: 'Examen de conciencia estoico',
    desc: 'Tres preguntas de Marco Aurelio antes de dormir.',
    steps: [
      '¿Qué hice bien hoy?',
      '¿Qué podría haber hecho mejor?',
      '¿Qué dejé sin hacer que debí hacer?',
    ],
  },
  {
    name: 'Dicotomía del control',
    latin: 'Eph\'hēmin / Ouk eph\'hēmin',
    desc: 'Separa lo que depende de ti de lo que no.',
    steps: [
      'Identifica una situación que te preocupa.',
      'Divide los aspectos en: lo que puedes controlar y lo que no.',
      'Dirige toda tu energía hacia lo que puedes controlar.',
      'Acepta con serenidad lo que no depende de ti.',
    ],
  },
];

export default function PhilosophyScreen() {
  const [section, setSection] = useState<ActiveSection>('home');
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<StoicQuote[]>([]);
  const [dailyQuote, setDailyQuote] = useState<StoicQuote | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<typeof exercises[0] | null>(null);

  useEffect(() => {
    ContentProvider.getDailyStoicQuote().then((q) => {
      if (q) setDailyQuote(q as unknown as StoicQuote);
    });
  }, []);

  const loadAuthor = async (author: string) => {
    const data = await ContentProvider.getQuotesByAuthor(author);
    setQuotes(data as StoicQuote[]);
    setSelectedAuthor(author);
    setSection('author');
  };

  if (section === 'author' && selectedAuthor) {
    const info = authorInfo[selectedAuthor];
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.cream }}>
        <TouchableOpacity
          onPress={() => setSection('home')}
          style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
          <Text style={{ marginLeft: 8, color: colors.primary, fontWeight: '600' }}>Volver</Text>
        </TouchableOpacity>
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <Text style={{ fontSize: 26, fontWeight: '700', color: colors.primary }}>
            {authorNames[selectedAuthor]}
          </Text>
          <Text style={{ fontSize: 14, color: colors.secondary, marginTop: 2 }}>{info.years}</Text>
          <Text style={{ fontSize: 15, color: colors.textMain, marginTop: 8, lineHeight: 22 }}>{info.desc}</Text>
          <Text style={{ fontSize: 13, color: colors.textSoft, marginTop: 4 }}>Obras: {info.works}</Text>
        </View>
        {quotes.map((q, idx) => (
          <QuoteDisplay key={idx} text={q.text} author={selectedAuthor} source={`${q.work}, ${q.book_chapter}`} />
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>
    );
  }

  if (section === 'glossary') {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.cream }}>
        <TouchableOpacity
          onPress={() => setSection('home')}
          style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
          <Text style={{ marginLeft: 8, color: colors.primary, fontWeight: '600' }}>Volver</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: '700', color: colors.primary, paddingHorizontal: 20, marginBottom: 16 }}>
          Glosario Estoico
        </Text>
        {stoicGlossary.map((item, idx) => (
          <View
            key={idx}
            style={{
              marginHorizontal: 16,
              marginBottom: 8,
              backgroundColor: '#E8E0F0',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary }}>{item.term}</Text>
              <Text style={{ marginLeft: 8, fontSize: 13, color: colors.textSoft, fontStyle: 'italic' }}>
                [{item.pron}]
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: colors.textMain, marginTop: 4 }}>{item.meaning}</Text>
          </View>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>
    );
  }

  if (section === 'exercises') {
    if (selectedExercise) {
      return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.cream }}>
          <TouchableOpacity
            onPress={() => setSelectedExercise(null)}
            style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
            <Text style={{ marginLeft: 8, color: colors.primary, fontWeight: '600' }}>Volver</Text>
          </TouchableOpacity>
          <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: colors.primary }}>{selectedExercise.name}</Text>
            <Text style={{ fontSize: 14, fontStyle: 'italic', color: colors.secondary, marginTop: 4 }}>
              {selectedExercise.latin}
            </Text>
            <Text style={{ fontSize: 15, lineHeight: 24, color: colors.textMain, marginTop: 12 }}>
              {selectedExercise.desc}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, marginTop: 24, marginBottom: 12 }}>
              Pasos
            </Text>
            {selectedExercise.steps.map((step, idx) => (
              <View key={idx} style={{ flexDirection: 'row', marginBottom: 12 }}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '700' }}>{idx + 1}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 15, lineHeight: 22, color: colors.textMain }}>
                  {step}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.cream }}>
        <TouchableOpacity
          onPress={() => setSection('home')}
          style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
          <Text style={{ marginLeft: 8, color: colors.primary, fontWeight: '600' }}>Volver</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: '700', color: colors.primary, paddingHorizontal: 20, marginBottom: 4 }}>
          Ejercicios Espirituales
        </Text>
        <Text style={{ fontSize: 14, color: colors.textSoft, paddingHorizontal: 20, marginBottom: 16 }}>
          Askesis — Prácticas diarias estoicas
        </Text>
        {exercises.map((ex, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => setSelectedExercise(ex)}
            style={{
              marginHorizontal: 16,
              marginBottom: 12,
              backgroundColor: '#FFF',
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textMain }}>{ex.name}</Text>
            <Text style={{ fontSize: 13, fontStyle: 'italic', color: colors.primary, marginTop: 2 }}>{ex.latin}</Text>
            <Text style={{ fontSize: 13, color: colors.textSoft, marginTop: 6 }}>{ex.desc}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>
    );
  }

  if (section === 'virtues') {
    const virtues = [
      {
        name: 'Sabiduría',
        greek: 'Sophia / Prudentia',
        desc: 'La capacidad de discernir el bien del mal, lo verdadero de lo falso. Es la virtud directriz que guía a todas las demás.',
        practice: 'Ante cada decisión, pregúntate: ¿esto contribuye al bien? ¿Es conforme a la razón?',
      },
      {
        name: 'Justicia',
        greek: 'Dikaiosyne / Iustitia',
        desc: 'Dar a cada uno lo que le corresponde. Incluye la bondad, la equidad y el servicio a la comunidad.',
        practice: 'Trata a cada persona con dignidad. No tomes más de lo que mereces ni des menos de lo que debes.',
      },
      {
        name: 'Fortaleza',
        greek: 'Andreia / Fortitudo',
        desc: 'La resistencia ante el dolor, el miedo y la adversidad. No es ausencia de temor, sino actuar correctamente a pesar de él.',
        practice: 'Cuando sientas miedo o incomodidad, pregúntate si la acción correcta requiere que persistas.',
      },
      {
        name: 'Templanza',
        greek: 'Sophrosyne / Temperantia',
        desc: 'La moderación de los deseos y las pasiones. El equilibrio entre el exceso y la carencia.',
        practice: 'Observa tus impulsos antes de actuar. ¿Es necesario? ¿Es moderado? ¿Sirve a la virtud?',
      },
    ];

    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.cream }}>
        <TouchableOpacity
          onPress={() => setSection('home')}
          style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
          <Text style={{ marginLeft: 8, color: colors.primary, fontWeight: '600' }}>Volver</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: '700', color: colors.primary, paddingHorizontal: 20, marginBottom: 4 }}>
          Las Cuatro Virtudes Cardinales
        </Text>
        <Text style={{ fontSize: 14, color: colors.textSoft, paddingHorizontal: 20, marginBottom: 20 }}>
          Pilares de la ética estoica
        </Text>
        {virtues.map((v, idx) => (
          <View
            key={idx}
            style={{
              marginHorizontal: 16, marginBottom: 16, backgroundColor: '#FFF',
              borderRadius: 16, padding: 20, borderLeftWidth: 4, borderLeftColor: colors.secondary,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.primary }}>{v.name}</Text>
            <Text style={{ fontSize: 13, fontStyle: 'italic', color: colors.secondary, marginTop: 2 }}>
              {v.greek}
            </Text>
            <Text style={{ fontSize: 15, lineHeight: 24, color: colors.textMain, marginTop: 12 }}>
              {v.desc}
            </Text>
            <View style={{ marginTop: 12, backgroundColor: '#F0E6D3', borderRadius: 10, padding: 12 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary, marginBottom: 4 }}>
                PRÁCTICA DIARIA
              </Text>
              <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textMain, fontStyle: 'italic' }}>
                {v.practice}
              </Text>
            </View>
          </View>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>
    );
  }

  // Home section
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.cream }}>
      {/* Daily quote */}
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, paddingHorizontal: 16, paddingTop: 16, marginBottom: 4 }}>
        Reflexión del día
      </Text>
      {dailyQuote && (
        <QuoteDisplay
          text={dailyQuote.text}
          author={dailyQuote.author}
          source={dailyQuote.book_chapter}
        />
      )}

      {/* Authors */}
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, paddingHorizontal: 16, marginTop: 16, marginBottom: 12 }}>
        Los Grandes Estoicos
      </Text>
      {Object.entries(authorInfo).map(([key, info]) => (
        <TouchableOpacity
          key={key}
          onPress={() => loadAuthor(key)}
          style={{
            marginHorizontal: 16,
            marginBottom: 12,
            backgroundColor: '#FFF',
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: '#E8E0F0',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 22 }}>🏛️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textMain }}>
                {authorNames[key]}
              </Text>
              <Text style={{ fontSize: 12, color: colors.secondary }}>{info.years}</Text>
              <Text style={{ fontSize: 12, color: colors.textSoft, marginTop: 2 }} numberOfLines={1}>
                {info.works}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSoft} />
          </View>
        </TouchableOpacity>
      ))}

      {/* Quick links */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 12, marginTop: 8, marginBottom: 30 }}>
        <TouchableOpacity
          onPress={() => setSection('glossary')}
          style={{
            flex: 1,
            margin: 4,
            backgroundColor: colors.primary,
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Ionicons name="language" size={24} color={colors.secondary} />
          <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '700', marginTop: 8 }}>Glosario</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSection('exercises')}
          style={{
            flex: 1,
            margin: 4,
            backgroundColor: colors.primary,
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Ionicons name="fitness" size={24} color={colors.secondary} />
          <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '700', marginTop: 8 }}>Ejercicios</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSection('virtues')}
          style={{
            flex: 1,
            margin: 4,
            backgroundColor: colors.primary,
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Ionicons name="shield-checkmark" size={24} color={colors.secondary} />
          <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '700', marginTop: 8 }}>Virtudes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
