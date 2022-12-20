export type Reservation = {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'pending' | 'approved' | 'staying' | 'stayed' | 'canceled' | null;
  home: {
    id: string;
    name: string;
    room: string;
  };
};
