export const getLocalDateKey = (date = new Date()): string => {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

export const getYesterdayDateKey = (date = new Date()): string => {
  const d = new Date(date.getTime() - 24 * 60 * 60 * 1000);
  return getLocalDateKey(d);
};

export const getDaysDifference = (fromDateStr: string, toDateStr: string): number => {
  try {
    const d1 = new Date(fromDateStr + 'T00:00:00');
    const d2 = new Date(toDateStr + 'T00:00:00');
    const diffTime = d2.getTime() - d1.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
};