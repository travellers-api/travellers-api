export type Reservation = {
  id: string;
  status: 'pending' | 'approved' | 'staying' | 'stayed' | 'canceled' | 'rejected' | null;
  checkInDate: string;
  checkOutDate: string;
  home: {
    id: string;
    name: string;
    room: string;
  };
};
