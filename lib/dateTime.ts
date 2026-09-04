export const SCHOOL_TIME_ZONE = 'Europe/London';

export function formatSchoolDateTime(
  value: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {},
) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: SCHOOL_TIME_ZONE,
    ...options,
  }).format(date);
}

function partsForSchoolTime(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: SCHOOL_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

export function toSchoolDateTimeInput(value: string | null | undefined) {
  if (!value) return '';
  const parts = partsForSchoolTime(new Date(value));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

function schoolOffsetMs(date: Date) {
  const parts = partsForSchoolTime(date);
  const representedAsUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  const wholeSecondDate = Math.floor(date.getTime() / 1000) * 1000;
  return representedAsUtc - wholeSecondDate;
}

export function schoolLocalInputToIso(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) throw new Error('Invalid school date and time.');

  const [, year, month, day, hour, minute] = match;
  const wallClockAsUtc = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );

  let instant = wallClockAsUtc;
  for (let i = 0; i < 3; i += 1) {
    const offset = schoolOffsetMs(new Date(instant));
    instant = wallClockAsUtc - offset;
  }

  return new Date(instant).toISOString();
}
