import { Home } from '@travellers-api/address-fetcher/lib/core/home/types';

export type CachedAddressHome = Omit<Home, 'rooms'> & {
  rooms: (Home['rooms'][0] & {
    calendar: {
      reservedDates: string[];
      calStartDate: string;
      calEndDate: string;
      reservablePeriod: string;
      holidays: (0 | 1 | 2 | 3 | 4 | 5 | 6)[];
      minDays: number;
      availableWeeks: number;
    } | null;
  })[];
};
