import { Home } from '../shared/home-title/types';

export type Reservation = {
  id: string;
  status: 'pending' | 'approved' | 'staying' | 'stayed' | 'canceled' | 'rejected' | null;
  checkInDate: string;
  checkOutDate: string;
  home: Home;
};
