import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const convertToJst = (date: Date): string => {
  return dayjs(date).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss');
};
