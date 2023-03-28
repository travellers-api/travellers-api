import { HomeReservationStatus } from '@traveller-api/circle-fetcher/lib/core/home-reservation-status/types';
import { Home } from '@traveller-api/circle-fetcher/lib/core/home/types';

export type CachedCircleHome = Home & {
  calendar: HomeReservationStatus[];
};
