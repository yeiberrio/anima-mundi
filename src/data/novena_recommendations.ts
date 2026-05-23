// Día de la semana: 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado

export interface NovenaRecommendation {
  novenaId: string;
  saint: string;
  recommendedDay: number; // día de la semana recomendado para iniciar
  dayName: string;
  reason: string;
  history: string;
  miracles: string;
  feastDay: string; // fecha de festividad "DD/MM"
  feastMonth: number;
  feastDayNum: number;
}

export const NOVENA_RECOMMENDATIONS: NovenaRecommendation[] = [
  {
    novenaId: 'san_jose',
    saint: 'San José',
    recommendedDay: 1, // Lunes
    dayName: 'Lunes',
    reason: 'El lunes, inicio de la semana laboral, es ideal para invocar a San José, patrono de los trabajadores. Comenzar la semana encomendando tu trabajo y familia a su protección te acompañará durante los 9 días con su ejemplo de dedicación y fe silenciosa.',
    history: 'San José fue un humilde carpintero de Nazaret, esposo de la Virgen María y padre adoptivo de Jesús. Las Escrituras lo describen como un "hombre justo" (Mt 1,19). Cuando supo que María esperaba un hijo, un ángel le reveló en sueños el misterio de la Encarnación. Sin dudar, acogió a María y protegió al Niño Jesús, huyendo a Egipto para salvarlo de Herodes. Vivió en silencio, obediencia y trabajo, siendo el guardián de la Sagrada Familia.',
    miracles: '• Santa Teresa de Ávila afirmó que nunca le pidió algo a San José sin obtenerlo, y lo declaró patrono de sus fundaciones.\n• En 1637, los religiosos agustinos de Montreal atribuyeron la salvación de su misión a la intercesión de San José durante un ataque.\n• El Hermano André de Montreal (canonizado en 2010) construyó el Oratorio de San José, donde se documentaron miles de curaciones milagrosas.\n• El Papa Pío IX lo proclamó Patrono de la Iglesia Universal en 1870, reconociendo siglos de intercesiones.',
    feastDay: '19/03',
    feastMonth: 3,
    feastDayNum: 19,
  },
  {
    novenaId: 'san_judas_tadeo',
    saint: 'San Judas Tadeo',
    recommendedDay: 3, // Miércoles
    dayName: 'Miércoles',
    reason: 'El miércoles, a mitad de semana cuando las dificultades se acumulan, es el día perfecto para acudir a San Judas Tadeo, patrono de las causas imposibles. Cuando sientes que no hay solución, él intercede con poder especial ante Dios.',
    history: 'San Judas Tadeo fue uno de los doce apóstoles, primo de Jesús (hijo de Cleofás, hermano de San José). No debe confundirse con Judas Iscariote. En la Última Cena, fue quien preguntó a Jesús: "Señor, ¿cómo es que te manifestarás a nosotros y no al mundo?" (Jn 14,22). Predicó el Evangelio en Mesopotamia, Libia y Persia, donde sufrió el martirio siendo decapitado con un hacha, razón por la cual se le representa con este instrumento.',
    miracles: '• Es el santo más invocado en Latinoamérica para causas desesperadas. Miles de testimonios relatan curaciones de enfermedades terminales tras su novena.\n• En la ciudad de México, su santuario en el templo de San Hipólito recibe millones de devotos cada 28 de octubre.\n• Se le atribuyen innumerables casos de personas que encontraron trabajo, resolvieron problemas legales o superaron adicciones tras invocar su intercesión.\n• Santa Brígida de Suecia tuvo una visión en la que Jesús le recomendó acudir a San Judas Tadeo en los momentos más difíciles.',
    feastDay: '28/10',
    feastMonth: 10,
    feastDayNum: 28,
  },
  {
    novenaId: 'santa_teresa_avila',
    saint: 'Santa Teresa de Ávila',
    recommendedDay: 4, // Jueves
    dayName: 'Jueves',
    reason: 'El jueves, día de la institución de la Eucaristía, es ideal para iniciar la novena a Santa Teresa, gran mística y maestra de la oración contemplativa. Ella enseñó que la oración es "tratar de amistad con quien sabemos nos ama".',
    history: 'Teresa de Cepeda y Ahumada nació en Ávila, España, en 1515. A los 20 años ingresó al Carmelo, donde vivió años de tibieza espiritual hasta su conversión definitiva a los 39 años ante una imagen de Cristo flagelado. Reformó la Orden Carmelita fundando 17 conventos, enfrentando la oposición de la Inquisición. Fue la primera mujer declarada Doctora de la Iglesia (1970). Sus obras "Las Moradas" y "Camino de Perfección" son clásicos de la literatura mística.',
    miracles: '• Experimentó éxtasis místicos, levitaciones y la transverberación del corazón (un ángel atravesó su corazón con un dardo de fuego divino).\n• Tras su muerte en 1582, su cuerpo permaneció incorrupto. Al exhumarlo, emanaba una fragancia de flores.\n• Su corazón, conservado en Alba de Tormes, muestra la marca visible de la transverberación.\n• Se le atribuyen numerosas curaciones milagrosas, especialmente de enfermedades del corazón y dolencias espirituales como la depresión y la aridez en la oración.',
    feastDay: '15/10',
    feastMonth: 10,
    feastDayNum: 15,
  },
  {
    novenaId: 'san_francisco',
    saint: 'San Francisco de Asís',
    recommendedDay: 5, // Viernes
    dayName: 'Viernes',
    reason: 'El viernes, día de la Pasión de Cristo, es el más apropiado para honrar a San Francisco, quien recibió los estigmas del Señor. Su amor radical por Cristo crucificado y por toda la creación inspira a vivir con sencillez y alegría.',
    history: 'Giovanni di Pietro Bernardone (1181-1226), hijo de un rico comerciante de Asís, vivió una juventud mundana hasta que una serie de encuentros con la pobreza y la enfermedad lo transformaron. En la iglesia de San Damián, escuchó al crucifijo decirle: "Francisco, repara mi Iglesia". Renunció a toda riqueza ante su padre y el obispo, fundó la Orden de los Frailes Menores y vivió en radical pobreza e imitación de Cristo.',
    miracles: '• En septiembre de 1224, en el monte Alverna, recibió los estigmas: las cinco llagas de Cristo en manos, pies y costado, siendo la primera persona documentada con este don.\n• Predicó a los pájaros, que se posaron a escucharlo en silencio. Amansó al lobo de Gubbio que aterrorizaba a la ciudad.\n• El "Cántico de las Criaturas" que compuso es considerado la primera obra literaria en lengua italiana.\n• Tras su muerte, su cuerpo mostró las marcas de los estigmas visibles a todos los presentes. Fue canonizado solo dos años después de su muerte.',
    feastDay: '04/10',
    feastMonth: 10,
    feastDayNum: 4,
  },
  {
    novenaId: 'san_antonio_padua',
    saint: 'San Antonio de Padua',
    recommendedDay: 2, // Martes
    dayName: 'Martes',
    reason: 'La tradición católica dedica los martes a San Antonio de Padua. En muchas iglesias se celebran los "Trece Martes de San Antonio". Es el día ideal para pedirle que te ayude a encontrar lo que has perdido, ya sean objetos, la fe o la esperanza.',
    history: 'Fernando de Bulloes nació en Lisboa, Portugal, en 1195. Ingresó a los agustinos pero, inspirado por el martirio de frailes franciscanos en Marruecos, se unió a la Orden de San Francisco. Dotado de una memoria prodigiosa y una elocuencia extraordinaria, fue llamado "Arca del Testamento" por el Papa Gregorio IX. Predicó por toda Italia y Francia, convirtiendo herejes y pecadores con la fuerza de su palabra.',
    miracles: '• Un hereje desafió a Antonio a probar la presencia real de Cristo en la Eucaristía. Antonio ordenó a una mula hambrienta elegir entre avena y la Hostia consagrada. El animal se arrodilló ante el Sacramento.\n• Predicó a los peces cuando los herejes se negaron a escucharlo. Los peces asomaron sus cabezas del agua en atención.\n• Es universalmente invocado para encontrar objetos perdidos. Un novicio robó su libro de salmos; Antonio oró y el ladrón se sintió obligado a devolverlo.\n• Fue declarado Doctor de la Iglesia y es uno de los santos más rápidamente canonizados de la historia (menos de un año después de su muerte).',
    feastDay: '13/06',
    feastMonth: 6,
    feastDayNum: 13,
  },
  {
    novenaId: 'san_miguel_arcangel',
    saint: 'San Miguel Arcángel',
    recommendedDay: 1, // Lunes
    dayName: 'Lunes',
    reason: 'El lunes, al comenzar la semana, es momento de pedir la protección de San Miguel Arcángel contra las fuerzas del mal. Su nombre significa "¿Quién como Dios?" y su intercesión es poderosa para iniciar cada semana con fortaleza espiritual.',
    history: 'San Miguel Arcángel es el príncipe de los ejércitos celestiales, mencionado en el libro de Daniel, la Carta de Judas y el Apocalipsis. Lideró la batalla contra Satanás y los ángeles rebeldes, arrojándolos del cielo con el grito: "¿Quién como Dios?" (en hebreo: Mi-ka-El). Es considerado el defensor de la Iglesia, protector de los moribundos y conductor de las almas al cielo.',
    miracles: '• En el año 590, durante una plaga en Roma, el Papa Gregorio Magno vio a San Miguel envainando su espada sobre el Castillo de Sant\'Angelo, señalando el fin de la pestilencia.\n• En el Monte Gargano (Italia, siglo V), un toro perdido fue hallado en una cueva donde San Miguel se apareció al obispo, estableciendo uno de los santuarios más antiguos de la cristiandad.\n• En 1917, el Ángel de la Paz (identificado como San Miguel) se apareció a los niños de Fátima antes de las apariciones de la Virgen, enseñándoles oraciones de reparación.\n• El Papa León XIII compuso la oración a San Miguel en 1886 tras una visión de los ataques del demonio contra la Iglesia.',
    feastDay: '29/09',
    feastMonth: 9,
    feastDayNum: 29,
  },
  {
    novenaId: 'santa_rita',
    saint: 'Santa Rita de Cascia',
    recommendedDay: 4, // Jueves
    dayName: 'Jueves',
    reason: 'El jueves es ideal para iniciar la novena a Santa Rita, patrona de las causas imposibles. Su vida de sufrimiento transformado en gracia nos enseña que Dios puede obrar maravillas incluso en las situaciones más difíciles.',
    history: 'Rita nació en Roccaporena, Italia, en 1381. Obligada a casarse con un hombre violento, soportó 18 años de maltrato con paciencia cristiana hasta que su esposo fue asesinado. Sus dos hijos juraron vengar a su padre, pero Rita oró para que murieran antes de cometer el pecado, y ambos fallecieron de enfermedad. Viuda y sin hijos, pidió tres veces entrar al convento agustino y fue rechazada. Finalmente, fue admitida milagrosamente.',
    miracles: '• Recibió un estigma en la frente: una espina de la corona de Cristo se clavó en ella durante una meditación, dejando una herida que nunca sanó y que despedía mal olor, obligándola al aislamiento.\n• En su lecho de muerte, en pleno invierno, pidió una rosa del jardín de su casa natal. Su prima encontró un rosal florecido milagrosamente. Por esto se le asocia con las rosas.\n• Su cuerpo permanece incorrupto desde 1457, expuesto en una urna de cristal en Cascia.\n• Miles de testimonios la invocan para matrimonios difíciles, reconciliaciones familiares y situaciones consideradas humanamente imposibles.',
    feastDay: '22/05',
    feastMonth: 5,
    feastDayNum: 22,
  },
  {
    novenaId: 'virgen_guadalupe',
    saint: 'Nuestra Señora de Guadalupe',
    recommendedDay: 6, // Sábado
    dayName: 'Sábado',
    reason: 'El sábado es el día mariano por excelencia, dedicado a la Virgen María. Es el momento perfecto para iniciar la novena a Nuestra Señora de Guadalupe, Patrona de América, Madre de todos los pueblos del continente.',
    history: 'Entre el 9 y el 12 de diciembre de 1531, la Virgen María se apareció cuatro veces al indígena San Juan Diego en el cerro del Tepeyac, Ciudad de México. Se presentó como la "Madre del verdadero Dios por quien se vive" y pidió la construcción de un templo. Como señal, hizo florecer rosas en pleno invierno y dejó su imagen impresa milagrosamente en la tilma (manto) de Juan Diego.',
    miracles: '• La tilma de Juan Diego, hecha de fibra de maguey (que dura 20 años), se conserva intacta después de casi 500 años sin tratamiento alguno.\n• La imagen no tiene pinceladas; científicos de la NASA determinaron que no fue hecha por mano humana.\n• En los ojos de la Virgen en la tilma, ampliados digitalmente, se reflejan las figuras de las personas presentes cuando Juan Diego abrió su manto ante el obispo.\n• En 1921, una bomba colocada bajo la imagen destrozó todo a su alrededor, pero la tilma quedó intacta.\n• Tras las apariciones, 9 millones de indígenas se convirtieron al cristianismo en solo 7 años.',
    feastDay: '12/12',
    feastMonth: 12,
    feastDayNum: 12,
  },
  {
    novenaId: 'virgen_carmen',
    saint: 'Nuestra Señora del Carmen',
    recommendedDay: 6, // Sábado
    dayName: 'Sábado',
    reason: 'El sábado, día de la Virgen, es especialmente significativo para la devoción al Carmen. La Virgen prometió el "Privilegio Sabatino": liberar del purgatorio el primer sábado después de su muerte a quienes lleven el escapulario con devoción.',
    history: 'La devoción a Nuestra Señora del Monte Carmelo tiene sus raíces en los ermitaños que vivían en el Monte Carmelo (Israel) desde el siglo XII, inspirados por el profeta Elías. El 16 de julio de 1251, la Virgen se apareció a San Simón Stock, superior general de los carmelitas, en Cambridge, Inglaterra, entregándole el escapulario marrón como señal de protección.',
    miracles: '• La Virgen prometió a San Simón Stock: "El que muera con este escapulario no sufrirá el fuego eterno".\n• El Papa Juan XXII recibió una aparición de la Virgen que le reveló el Privilegio Sabatino: los devotos del escapulario serían liberados del purgatorio el primer sábado después de su muerte.\n• En la Batalla de Lepanto (1571), los soldados cristianos llevaban el escapulario. La victoria fue atribuida a la intercesión de la Virgen del Carmen.\n• San Juan Pablo II llevó siempre el escapulario del Carmen desde su infancia. Dijo: "Llevo el escapulario desde que era niño y me da fuerza y consuelo".',
    feastDay: '16/07',
    feastMonth: 7,
    feastDayNum: 16,
  },
  {
    novenaId: 'virgen_fatima',
    saint: 'Nuestra Señora de Fátima',
    recommendedDay: 6, // Sábado
    dayName: 'Sábado',
    reason: 'La Virgen de Fátima pidió específicamente la devoción de los Cinco Primeros Sábados. El sábado es el día perfecto para honrarla e iniciar su novena, pidiendo la conversión de los pecadores y la paz en el mundo.',
    history: 'Entre mayo y octubre de 1917, la Virgen María se apareció seis veces a tres pastorcitos — Lucía, Francisco y Jacinta — en la Cova da Iria, Fátima, Portugal. Les reveló tres secretos: una visión del infierno, la predicción de la Segunda Guerra Mundial y la consagración de Rusia, y el tercer secreto (revelado en 2000) sobre la persecución de la Iglesia.',
    miracles: '• El 13 de octubre de 1917, ante 70,000 personas, el sol "danzó" en el cielo: giró, cambió de colores y pareció precipitarse sobre la tierra. Periodistas ateos y escépticos presenciaron y reportaron el fenómeno, conocido como "El Milagro del Sol".\n• Francisco y Jacinta, fallecidos durante la pandemia de gripe de 1918-1919, fueron canonizados en 2017 como los santos más jóvenes no mártires de la Iglesia.\n• El atentado contra San Juan Pablo II el 13 de mayo de 1981 (aniversario de la primera aparición) falló milagrosamente. El Papa atribuyó su supervivencia a la Virgen de Fátima y colocó la bala en la corona de la imagen.\n• La consagración de Rusia al Inmaculado Corazón de María (1984) precedió la caída del comunismo soviético en 1989-1991.',
    feastDay: '13/05',
    feastMonth: 5,
    feastDayNum: 13,
  },
  {
    novenaId: 'inmaculada_concepcion',
    saint: 'Inmaculada Concepción',
    recommendedDay: 6, // Sábado
    dayName: 'Sábado',
    reason: 'El sábado es el día mariano, y la Inmaculada Concepción es la fiesta que celebra la pureza absoluta de María desde el primer instante de su existencia. Iniciar esta novena en sábado honra el misterio de la gracia que preservó a María del pecado original.',
    history: 'El dogma de la Inmaculada Concepción fue proclamado por el Papa Pío IX el 8 de diciembre de 1854 en la bula "Ineffabilis Deus", declarando que María fue preservada del pecado original desde el momento de su concepción. Cuatro años después, en 1858, la Virgen se apareció en Lourdes a Santa Bernadette y confirmó: "Yo soy la Inmaculada Concepción".',
    miracles: '• En Lourdes, Francia, donde la Virgen confirmó su título, se han documentado 70 curaciones milagrosas oficialmente reconocidas por la Iglesia y miles más no oficiales.\n• La Medalla Milagrosa (1830), revelada a Santa Catalina Labouré, lleva la inscripción "Oh María, sin pecado concebida, ruega por nosotros" y se le atribuyen innumerables conversiones y curaciones.\n• El Papa Pío IX cuenta que al proclamar el dogma, un rayo de sol atravesó las nubes e iluminó exactamente el lugar donde él estaba, a pesar del mal tiempo.\n• La Inmaculada Concepción es patrona de varios países, incluyendo Estados Unidos, España, Brasil, Argentina y Nicaragua.',
    feastDay: '08/12',
    feastMonth: 12,
    feastDayNum: 8,
  },
  {
    novenaId: 'san_ignacio_loyola',
    saint: 'San Ignacio de Loyola',
    recommendedDay: 1, // Lunes
    dayName: 'Lunes',
    reason: 'El lunes es ideal para San Ignacio, maestro del discernimiento. Al inicio de la semana, sus Ejercicios Espirituales nos enseñan a "en todo amar y servir" y a tomar decisiones según la voluntad de Dios.',
    history: 'Íñigo López de Loyola (1491-1556) fue un soldado vasco cuya vida cambió cuando una bala de cañón le destrozó la pierna en la Batalla de Pamplona (1521). Durante su convalecencia, al no haber novelas de caballería, leyó vidas de santos y experimentó una conversión radical. Pasó un año en Manresa, donde escribió los "Ejercicios Espirituales". Fundó la Compañía de Jesús (jesuitas) en 1540, que se convirtió en la orden religiosa más influyente en la educación y las misiones.',
    miracles: '• Durante su estancia en Manresa, experimentó una iluminación mística junto al río Cardoner que, según él, le enseñó más que todos los estudios de su vida.\n• Los Ejercicios Espirituales, escritos en 30 días de retiro, han transformado millones de vidas en 500 años y son considerados una de las obras más influyentes de la espiritualidad cristiana.\n• La Compañía de Jesús fundó las primeras universidades modernas, evangelizó en Asia (San Francisco Javier llegó hasta Japón), y educó a figuras como Descartes y Voltaire.\n• Su lema "Ad Maiorem Dei Gloriam" (Para la mayor gloria de Dios) inspira la espiritualidad ignaciana hasta hoy. El Papa Francisco es el primer papa jesuita.',
    feastDay: '31/07',
    feastMonth: 7,
    feastDayNum: 31,
  },
  {
    novenaId: 'san_agustin',
    saint: 'San Agustín de Hipona',
    recommendedDay: 3, // Miércoles
    dayName: 'Miércoles',
    reason: 'El miércoles, a mitad de semana, es momento de reflexión y conversión. San Agustín, el gran converso, pasó de una vida de pecado a ser el más grande teólogo de la Iglesia. Su novena es ideal para quienes buscan una transformación interior profunda.',
    history: 'Aurelio Agustín (354-430) nació en Tagaste, norte de África. Vivió una juventud disipada: tuvo una concubina con quien tuvo un hijo (Adeodato), siguió la herejía maniquea y buscó la verdad en la filosofía neoplatónica. Su madre, Santa Mónica, oró por su conversión durante 17 años sin cesar. En Milán, la predicación de San Ambrosio y la lectura de San Pablo lo llevaron a su famosa conversión en el jardín (386), cuando escuchó una voz que decía: "Toma y lee".',
    miracles: '• Su conversión en el jardín de Milán, descrita en las "Confesiones", es una de las conversiones más célebres de la historia. Al abrir las Escrituras al azar, leyó Romanos 13,13-14 y su vida cambió instantáneamente.\n• Las "Confesiones" y "La Ciudad de Dios" son obras fundamentales del pensamiento occidental. Influyó en toda la teología cristiana por 1,600 años.\n• Su madre Santa Mónica lloró y oró por él durante 17 años. Un obispo le dijo: "Es imposible que el hijo de tantas lágrimas se pierda".\n• En su lecho de muerte, pidió que escribieran los Salmos Penitenciales en la pared para poder leerlos. Murió mientras los vándalos sitiaban Hipona.\n• Su frase más célebre resume su búsqueda: "Nos hiciste, Señor, para ti, y nuestro corazón está inquieto hasta que descanse en ti".',
    feastDay: '28/08',
    feastMonth: 8,
    feastDayNum: 28,
  },
];

/**
 * Obtiene las novenas recomendadas para hoy según el día de la semana
 */
export function getTodayRecommendations(): NovenaRecommendation[] {
  const today = new Date().getDay(); // 0=Dom, 1=Lun...6=Sab
  return NOVENA_RECOMMENDATIONS.filter((r) => r.recommendedDay === today);
}

/**
 * Obtiene la novena cuya festividad se acerca (para notificaciones)
 * Retorna novenas cuya fiesta es en los próximos 10-15 días (ideal para empezar novena de 9 días)
 */
export function getUpcomingFeastNovenas(): NovenaRecommendation[] {
  const now = new Date();
  const results: NovenaRecommendation[] = [];

  for (const rec of NOVENA_RECOMMENDATIONS) {
    // Calcular la fecha de la festividad este año
    const feastDate = new Date(now.getFullYear(), rec.feastMonth - 1, rec.feastDayNum);
    // Si ya pasó, calcular para el próximo año
    if (feastDate < now) {
      feastDate.setFullYear(feastDate.getFullYear() + 1);
    }
    const daysUntil = Math.floor((feastDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    // Recomendar si faltan entre 9 y 12 días (ideal para empezar la novena)
    if (daysUntil >= 9 && daysUntil <= 12) {
      results.push(rec);
    }
  }
  return results;
}
