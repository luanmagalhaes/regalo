export const nearWindow = 15;

export interface BirthdayParts {
  year: number;
  month: number;
  day: number;
}

const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  if (month === 2 && isLeapYear(year)) {
    return 29;
  }

  return monthLengths[month - 1] ?? 0;
}

export function parseBirthday(value: string | null): BirthdayParts | null {
  if (!value) {
    return null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    return null;
  }

  if (year < 1900 || year > 2100) {
    return null;
  }

  return { year, month, day };
}

function dayNumber(year: number, month: number, day: number): number {
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

function celebrationDay(parts: BirthdayParts, year: number): { month: number; day: number } {
  if (parts.month === 2 && parts.day === 29 && !isLeapYear(year)) {
    return { month: 3, day: 1 };
  }

  return { month: parts.month, day: parts.day };
}

export function today(now: Date = new Date()): BirthdayParts {
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

export function daysUntilBirthday(value: string | null, now: Date = new Date()): number | null {
  const parts = parseBirthday(value);

  if (!parts) {
    return null;
  }

  const reference = today(now);
  const current = dayNumber(reference.year, reference.month, reference.day);

  for (const year of [reference.year, reference.year + 1]) {
    const celebration = celebrationDay(parts, year);
    const target = dayNumber(year, celebration.month, celebration.day);

    if (target >= current) {
      return target - current;
    }
  }

  return null;
}

export function ageTurning(value: string | null, now: Date = new Date()): number | null {
  const parts = parseBirthday(value);
  const distance = daysUntilBirthday(value, now);

  if (!parts || distance === null) {
    return null;
  }

  const reference = today(now);
  const celebration = celebrationDay(parts, reference.year);
  const passed =
    reference.month > celebration.month ||
    (reference.month === celebration.month && reference.day > celebration.day);

  return (passed ? reference.year + 1 : reference.year) - parts.year;
}

export function currentAge(value: string | null, now: Date = new Date()): number | null {
  const turning = ageTurning(value, now);
  const distance = daysUntilBirthday(value, now);

  if (turning === null || distance === null) {
    return null;
  }

  return distance === 0 ? turning : turning - 1;
}

export function isNear(value: string | null, now: Date = new Date()): boolean {
  const distance = daysUntilBirthday(value, now);

  return distance !== null && distance <= nearWindow;
}

export function countdownLabel(distance: number | null): string {
  if (distance === null) {
    return "Aniversário ainda não preenchido";
  }

  if (distance === 0) {
    return "É hoje!";
  }

  if (distance === 1) {
    return "Amanhã";
  }

  return `Em ${distance} dias`;
}

const monthNames = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export function birthdayLabel(value: string | null): string | null {
  const parts = parseBirthday(value);

  if (!parts) {
    return null;
  }

  return `${parts.day} de ${monthNames[parts.month - 1]}`;
}

export function sortByNextBirthday<T extends { birthday: string | null; name: string }>(
  people: readonly T[],
  now: Date = new Date(),
): T[] {
  return [...people].sort((left, right) => {
    const leftDistance = daysUntilBirthday(left.birthday, now);
    const rightDistance = daysUntilBirthday(right.birthday, now);

    if (leftDistance === null && rightDistance === null) {
      return left.name.localeCompare(right.name, "pt-BR");
    }

    if (leftDistance === null) {
      return 1;
    }

    if (rightDistance === null) {
      return -1;
    }

    if (leftDistance === rightDistance) {
      return left.name.localeCompare(right.name, "pt-BR");
    }

    return leftDistance - rightDistance;
  });
}
