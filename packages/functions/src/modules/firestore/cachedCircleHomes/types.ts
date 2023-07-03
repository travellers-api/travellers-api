import { HomeReservationStatus } from '@travellers-api/circle-fetcher/lib/core/home-reservation-status/types';
import { Home } from '@travellers-api/circle-fetcher/lib/core/home/types';

export type CachedCircleHome = Home & {
  calendar: HomeReservationStatus[];
};
