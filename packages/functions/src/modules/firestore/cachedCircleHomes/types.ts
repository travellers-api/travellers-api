import { HomeReservationStatus } from '../../circle/home-reservation-status/types';
import { Home } from '../../circle/home/types';

export type CachedCircleHome = Home & {
  calendar: HomeReservationStatus[];
};
