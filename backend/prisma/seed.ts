import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function loadJson(filename: string) {
  // The data files live in backend/prisma/data and are copied into the Docker
  // image. Resolve against several candidate locations so this works both with
  // ts-node (prisma/seed.ts) and the compiled build (dist/prisma/seed.js).
  const candidates = [
    path.join(process.cwd(), 'prisma', 'data', filename), // /app/prisma/data (container)
    path.join(__dirname, '..', 'data', filename), // dist/prisma -> dist/data (if emitted)
    path.join(__dirname, 'data', filename),
    path.join(__dirname, '..', '..', 'prisma', 'data', filename),
  ];
  const filePath = candidates.find((p) => fs.existsSync(p));
  if (!filePath) {
    throw new Error(`Seed data file not found: ${filename}. Tried: ${candidates.join(', ')}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

async function main() {
  console.log('Seeding database...');

  // Bible verses (only if table is empty — no unique key for skipDuplicates to dedupe on)
  const bibleVerses = loadJson('bible_verses.json');
  if ((await prisma.bibleVerse.count()) === 0) {
    await prisma.bibleVerse.createMany({
      data: bibleVerses.map((v: any) => ({
        book: v.book,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text,
        tags: v.tags || [],
        isFeatured: v.is_featured === 1,
      })),
    });
    console.log(`  Bible verses: ${bibleVerses.length}`);
  } else {
    console.log('  Bible verses: already seeded, skipping');
  }

  // Stoic quotes (only if table is empty)
  const stoicQuotes = loadJson('stoic_quotes.json');
  if ((await prisma.stoicQuote.count()) === 0) {
    await prisma.stoicQuote.createMany({
      data: stoicQuotes.map((q: any) => ({
        author: q.author,
        work: q.work,
        bookChapter: q.book_chapter,
        text: q.text,
        theme: q.theme,
        isFeatured: q.is_featured === 1,
      })),
    });
    console.log(`  Stoic quotes: ${stoicQuotes.length}`);
  } else {
    console.log('  Stoic quotes: already seeded, skipping');
  }

  // Prayers (flatten categories — only if table is empty)
  const prayersData = loadJson('prayers.json');
  if ((await prisma.prayer.count()) === 0) {
    const prayers: any[] = [];
    for (const [category, items] of Object.entries(prayersData)) {
      for (const p of items as any[]) {
        prayers.push({
          name: p.name,
          category,
          text: p.text,
          sortOrder: p.sort_order || 0,
        });
      }
    }
    await prisma.prayer.createMany({ data: prayers });
    console.log(`  Prayers: ${prayers.length}`);
  } else {
    console.log('  Prayers: already seeded, skipping');
  }

  // Novenas
  const novenas = loadJson('novenas.json');
  for (const n of novenas) {
    await prisma.novena.upsert({
      where: { id: n.id },
      update: {},
      create: {
        id: n.id,
        saint: n.saint,
        feastDay: n.feast_day,
        intention: n.intention,
        description: n.description,
        days: n.days,
      },
    });
  }
  console.log(`  Novenas: ${novenas.length}`);

  // Mysteries
  const mysteries = loadJson('mysteries.json');
  for (const [key, set] of Object.entries(mysteries) as [string, any][]) {
    await prisma.mysterySet.upsert({
      where: { id: key },
      update: {},
      create: {
        id: key,
        name: set.name,
        days: set.days,
        dayNames: set.dayNames,
        mysteries: set.mysteries,
      },
    });
  }
  console.log(`  Mystery sets: ${Object.keys(mysteries).length}`);

  // Torah glossary
  const glossary = loadJson('torah_glossary.json');
  await prisma.torahGlossary.createMany({
    data: glossary.map((g: any) => ({
      term: g.term,
      pronunciation: g.pronunciation,
      meaning: g.meaning,
    })),
    skipDuplicates: true,
  });
  console.log(`  Torah glossary: ${glossary.length}`);

  // Novena recommendations (from TS export, parsed as data)
  const recommendations = [
    { novenaId: 'san_jose', saint: 'San José', recommendedDay: 1, dayName: 'Lunes', reason: 'El lunes, inicio de la semana laboral, es ideal para invocar a San José, patrono de los trabajadores.', history: 'San José fue un humilde carpintero de Nazaret, esposo de la Virgen María y padre adoptivo de Jesús.', miracles: 'Santa Teresa de Ávila afirmó que nunca le pidió algo a San José sin obtenerlo.', feastDay: '19/03', feastMonth: 3, feastDayNum: 19 },
    { novenaId: 'san_judas_tadeo', saint: 'San Judas Tadeo', recommendedDay: 3, dayName: 'Miércoles', reason: 'El miércoles, a mitad de semana cuando las dificultades se acumulan, es el día perfecto para acudir a San Judas Tadeo.', history: 'San Judas Tadeo fue uno de los doce apóstoles, primo de Jesús.', miracles: 'Es el santo más invocado en Latinoamérica para causas desesperadas.', feastDay: '28/10', feastMonth: 10, feastDayNum: 28 },
    { novenaId: 'santa_teresa_avila', saint: 'Santa Teresa de Ávila', recommendedDay: 4, dayName: 'Jueves', reason: 'El jueves, día de la institución de la Eucaristía, es ideal para iniciar la novena a Santa Teresa.', history: 'Teresa de Cepeda y Ahumada nació en Ávila, España, en 1515.', miracles: 'Experimentó éxtasis místicos, levitaciones y la transverberación del corazón.', feastDay: '15/10', feastMonth: 10, feastDayNum: 15 },
    { novenaId: 'san_francisco', saint: 'San Francisco de Asís', recommendedDay: 5, dayName: 'Viernes', reason: 'El viernes, día de la Pasión de Cristo, es el más apropiado para honrar a San Francisco.', history: 'Giovanni di Pietro Bernardone (1181-1226), hijo de un rico comerciante de Asís.', miracles: 'En septiembre de 1224, en el monte Alverna, recibió los estigmas.', feastDay: '04/10', feastMonth: 10, feastDayNum: 4 },
    { novenaId: 'san_antonio', saint: 'San Antonio de Padua', recommendedDay: 2, dayName: 'Martes', reason: 'El martes es el día tradicional dedicado a San Antonio de Padua.', history: 'Fernando de Bulloes nació en Lisboa en 1195.', miracles: 'Se le atribuyen innumerables casos de objetos perdidos encontrados.', feastDay: '13/06', feastMonth: 6, feastDayNum: 13 },
    { novenaId: 'san_miguel', saint: 'San Miguel Arcángel', recommendedDay: 1, dayName: 'Lunes', reason: 'El lunes es ideal para invocar la protección de San Miguel al inicio de la semana.', history: 'San Miguel Arcángel es el príncipe de la milicia celestial.', miracles: 'En el Monte Gargano (Italia, año 490), se apareció en una cueva.', feastDay: '29/09', feastMonth: 9, feastDayNum: 29 },
    { novenaId: 'santa_rita', saint: 'Santa Rita de Cascia', recommendedDay: 4, dayName: 'Jueves', reason: 'El jueves es ideal para invocar a Santa Rita, patrona de los imposibles.', history: 'Margherita Lotti nació en Roccaporena, Umbría, en 1381.', miracles: 'Mientras meditaba sobre la Pasión de Cristo, recibió un estigma en la frente.', feastDay: '22/05', feastMonth: 5, feastDayNum: 22 },
    { novenaId: 'virgen_guadalupe', saint: 'Virgen de Guadalupe', recommendedDay: 6, dayName: 'Sábado', reason: 'El sábado es el día mariano por excelencia, perfecto para iniciar la novena a la Virgen de Guadalupe.', history: 'Entre el 9 y 12 de diciembre de 1531, la Virgen María se apareció al indígena Juan Diego.', miracles: 'La tilma de Juan Diego, hecha de fibra de maguey, ha sobrevivido más de 490 años.', feastDay: '12/12', feastMonth: 12, feastDayNum: 12 },
    { novenaId: 'virgen_carmen', saint: 'Virgen del Carmen', recommendedDay: 6, dayName: 'Sábado', reason: 'El sábado, día mariano, es perfecto para honrar a la Virgen del Carmen.', history: 'La devoción a la Virgen del Carmen tiene origen en el Monte Carmelo.', miracles: 'San Simón Stock recibió el escapulario de manos de la Virgen en 1251.', feastDay: '16/07', feastMonth: 7, feastDayNum: 16 },
    { novenaId: 'virgen_fatima', saint: 'Virgen de Fátima', recommendedDay: 6, dayName: 'Sábado', reason: 'El sábado es el día mariano ideal para iniciar la novena a la Virgen de Fátima.', history: 'Entre mayo y octubre de 1917, la Virgen María se apareció seis veces a tres pastorcitos.', miracles: 'El 13 de octubre de 1917, aproximadamente 70,000 personas presenciaron el Milagro del Sol.', feastDay: '13/05', feastMonth: 5, feastDayNum: 13 },
    { novenaId: 'inmaculada_concepcion', saint: 'Inmaculada Concepción', recommendedDay: 0, dayName: 'Domingo', reason: 'El domingo, día del Señor, es perfecto para honrar a María en su misterio más puro.', history: 'El dogma de la Inmaculada Concepción fue proclamado por el Papa Pío IX en 1854.', miracles: 'En 1858, en Lourdes, la Virgen se presentó a Bernadette Soubirous diciendo: "Yo soy la Inmaculada Concepción".', feastDay: '08/12', feastMonth: 12, feastDayNum: 8 },
    { novenaId: 'san_ignacio', saint: 'San Ignacio de Loyola', recommendedDay: 1, dayName: 'Lunes', reason: 'El lunes es ideal para comenzar la semana con el discernimiento ignaciano.', history: 'Íñigo López de Loyola nació en 1491 en el castillo de Loyola, País Vasco.', miracles: 'Se le atribuyen múltiples curaciones milagrosas, especialmente de personas con crisis espirituales.', feastDay: '31/07', feastMonth: 7, feastDayNum: 31 },
    { novenaId: 'san_agustin', saint: 'San Agustín', recommendedDay: 0, dayName: 'Domingo', reason: 'El domingo, día de reflexión espiritual, es ideal para meditar con San Agustín.', history: 'Aurelio Agustín nació en Tagaste, norte de África, en 354.', miracles: 'Su conversión misma es considerada milagrosa.', feastDay: '28/08', feastMonth: 8, feastDayNum: 28 },
  ];

  for (const r of recommendations) {
    await prisma.novenaRecommendation.upsert({
      where: { novenaId: r.novenaId },
      update: {},
      create: r,
    });
  }
  console.log(`  Novena recommendations: ${recommendations.length}`);

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
