export type ReservationsResponse = {
  total_count: 1;
  reservations: {
    status: 'confirmed' | 'canceled' | 'declined';
    confirmation_number: string;
    check_in_date: string;
    check_out_date: string;
    pay_later: boolean;
    property: {
      name: string;
      prefecture: string;
      address: string;
      thumbnail_url: string;
    };
    split_reservation: boolean;
    representative: boolean;
  }[];
};

export type Reservation = {
  id: string;
  status: 'pending' | 'approved' | 'staying' | 'stayed' | 'canceled' | 'rejected' | null;
  checkInDate: string;
  checkOutDate: string;
  home: {
    name: string;
    city: string;
  };
};
