export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatTime = (time: string): string => {
  return time.slice(0, 5);
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return formatDate(date1) === formatDate(date2);
};

export const getDayName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

export const getMonthName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'long' });
};

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

export const getWeekdayNumber = (date: Date): number => {
  return date.getDay();
};

export const getNextWeekday = (date: Date, targetWeekday: number): Date => {
  const currentWeekday = getWeekdayNumber(date);
  const daysUntilTarget = (targetWeekday - currentWeekday + 7) % 7;
  return addDays(date, daysUntilTarget === 0 ? 7 : daysUntilTarget);
};