import { useState, useCallback, useMemo } from 'react';
import mysteriesData from '../data/mysteries.json';

type MysteryType = 'gozosos' | 'luminosos' | 'dolorosos' | 'gloriosos';

interface RosaryStep {
  type: 'sign_cross' | 'creed' | 'our_father' | 'hail_mary' | 'glory' | 'fatima' | 'mystery_announcement' | 'salve';
  title: string;
  text: string;
  mysteryNumber?: number;
  hailMaryNumber?: number;
}

function getMysteryTypeForDay(dayOfWeek: number): MysteryType {
  const mapping: Record<number, MysteryType> = {
    0: 'gloriosos',
    1: 'gozosos',
    2: 'dolorosos',
    3: 'gloriosos',
    4: 'luminosos',
    5: 'dolorosos',
    6: 'gozosos',
  };
  return mapping[dayOfWeek];
}

const PRAYERS = {
  sign_cross: 'En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.',
  creed: 'Creo en Dios, Padre todopoderoso, Creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios, Padre todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos. Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén.',
  our_father: 'Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.',
  hail_mary: 'Dios te salve, María, llena eres de gracia; el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.',
  glory: 'Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.',
  fatima: 'Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia. Amén.',
  salve: 'Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra; Dios te salve. A ti llamamos los desterrados hijos de Eva; a ti suspiramos, gimiendo y llorando en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro, muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh, clementísima, oh piadosa, oh dulce Virgen María! Ruega por nosotros, Santa Madre de Dios, para que seamos dignos de alcanzar las promesas de nuestro Señor Jesucristo. Amén.',
};

function buildRosarySteps(mysteryType: MysteryType): RosaryStep[] {
  const mysteries = (mysteriesData as Record<string, typeof mysteriesData.gozosos>)[mysteryType].mysteries;
  const steps: RosaryStep[] = [];

  // Opening
  steps.push({ type: 'sign_cross', title: 'Señal de la Cruz', text: PRAYERS.sign_cross });
  steps.push({ type: 'creed', title: 'Credo Apostólico', text: PRAYERS.creed });
  steps.push({ type: 'our_father', title: 'Padre Nuestro', text: PRAYERS.our_father });

  // 3 Hail Marys for faith, hope, charity
  const virtues = ['la Fe', 'la Esperanza', 'la Caridad'];
  for (let i = 0; i < 3; i++) {
    steps.push({
      type: 'hail_mary',
      title: `Ave María por ${virtues[i]}`,
      text: PRAYERS.hail_mary,
      hailMaryNumber: i + 1,
    });
  }
  steps.push({ type: 'glory', title: 'Gloria', text: PRAYERS.glory });

  // 5 Mysteries
  for (const mystery of mysteries) {
    steps.push({
      type: 'mystery_announcement',
      title: `${mystery.number}° Misterio: ${mystery.title}`,
      text: mystery.meditation,
      mysteryNumber: mystery.number,
    });
    steps.push({ type: 'our_father', title: 'Padre Nuestro', text: PRAYERS.our_father, mysteryNumber: mystery.number });

    for (let i = 1; i <= 10; i++) {
      steps.push({
        type: 'hail_mary',
        title: `Ave María ${i}/10`,
        text: PRAYERS.hail_mary,
        mysteryNumber: mystery.number,
        hailMaryNumber: i,
      });
    }

    steps.push({ type: 'glory', title: 'Gloria', text: PRAYERS.glory, mysteryNumber: mystery.number });
    steps.push({ type: 'fatima', title: 'Oración de Fátima', text: PRAYERS.fatima, mysteryNumber: mystery.number });
  }

  // Closing
  steps.push({ type: 'salve', title: 'Salve Regina', text: PRAYERS.salve });

  return steps;
}

export function useRosary(mode: 'auto' | 'manual' = 'auto') {
  const dayOfWeek = new Date().getDay();
  const autoType = getMysteryTypeForDay(dayOfWeek);
  const [mysteryType, setMysteryType] = useState<MysteryType>(autoType);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = useMemo(() => buildRosarySteps(mysteryType), [mysteryType]);
  const totalSteps = steps.length;
  const step = steps[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isComplete = currentStep >= totalSteps - 1;

  const currentMysteryInfo = useMemo(() => {
    if (!step?.mysteryNumber) return null;
    const data = (mysteriesData as Record<string, typeof mysteriesData.gozosos>)[mysteryType];
    return data.mysteries.find((m) => m.number === step.mysteryNumber) ?? null;
  }, [step, mysteryType]);

  const next = useCallback(() => {
    if (currentStep < totalSteps - 1) setCurrentStep((s) => s + 1);
  }, [currentStep, totalSteps]);

  const prev = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  const reset = useCallback(() => setCurrentStep(0), []);

  const changeMystery = useCallback((type: MysteryType) => {
    setMysteryType(type);
    setCurrentStep(0);
  }, []);

  const mysteryName = (mysteriesData as Record<string, typeof mysteriesData.gozosos>)[mysteryType].name;

  return {
    step,
    currentStep,
    totalSteps,
    progress,
    isComplete,
    mysteryType,
    mysteryName,
    currentMysteryInfo,
    next,
    prev,
    reset,
    changeMystery,
  };
}

export type { MysteryType, RosaryStep };
