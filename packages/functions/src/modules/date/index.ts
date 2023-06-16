import { dayjs } from '../../lib/dayjs';

const getSeparator = (date: string): string => {
  return date.slice(4, 5);
};

export const addDays = (date: string, days: number): string => {
  const separator = getSeparator(date);
  return dayjs(date).add(days, 'days').format(`YYYY${separator}MM${separator}DD`);
};

export const addMonths = (date: string, months: number): string => {
  const separator = getSeparator(date);
  return dayjs(date).add(months, 'month').format(`YYYY${separator}MM${separator}DD`);
};

export const getDiffDays = (from: string, to: string): number => {
  return dayjs(from).diff(to, 'days');
};
