import { Home } from '@traveller-api/address-fetcher/lib/core/home/types';

export type AddressCalendar = {
  homes: Omit<Home, 'address'>[];
};
