export type Reservation = {
  checkInDate: string;
  checkOutDate: string;
  home: {
    id: string;
    name: string;
    room: string;
  };
};
