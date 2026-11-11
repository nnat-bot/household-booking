const CATEGORY_LABELS: Record<string, string> = {
  standard: 'Standard',
  deep: 'Deep',
  window: 'Windows',
  moveout: 'Move-out',
};

export function formatCategory(value: string): string {
  return CATEGORY_LABELS[value] ?? value;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function toDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function toDateString(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function formatDate(value: string): string {
  const date = toDate(value);
  return `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function formatTime(value: string): string {
  return value.slice(0, 5);
}

export function formatPrice(value: string): string {
  const price = Number(value);
  return Number.isInteger(price) ? `${price}€` : `${price.toFixed(2)}€`;
}

export function formatRating(rating: string | null, count?: string): string {
  if (!rating) {
    return 'No reviews yet';
  }
  return count ? `${rating} ★ (${count})` : `${rating} ★`;
}
