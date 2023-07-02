import { Home } from '@travellers-api/address-fetcher/lib/core/home/types';

export type AddressCalendar = {
  homes: Omit<Home, 'address'>[];
};
