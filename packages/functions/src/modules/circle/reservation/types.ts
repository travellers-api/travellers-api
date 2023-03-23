import { Home } from '../shared/house-title/types';

export type Reservation = {
  id: string;
  status: 'pending' | 'approved' | 'staying' | 'stayed' | 'canceled' | null;
  checkInDate: string;
  checkOutDate: string;
  house: Home;
};
