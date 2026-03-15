export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export function getTodayMysteryType(): string {
  const day = new Date().getDay();
  const names: Record<number, string> = {
    0: 'Gloriosos',
    1: 'Gozosos',
    2: 'Dolorosos',
    3: 'Gloriosos',
    4: 'Luminosos',
    5: 'Dolorosos',
    6: 'Gozosos',
  };
  return names[day];
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
