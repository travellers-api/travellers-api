export type Reservation = {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  home: {
    id: string;
    name: string;
    room: string;
  };
};
