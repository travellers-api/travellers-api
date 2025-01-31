export type Home = {
  id: number;
  url: string;
  name: string;
  thumbnail: string;
  prefecture: string;
  homeType: string;
  reservationLimit: "予約制限あり" | "予約制限なし";
  rooms?: Room[];
};

export type Room = {
  id: number;
  name: string;
  thumbnail: string;
  type: "個室" | "ドミトリー";
  capacity: number;
  sex: "male" | "female" | null;
  availables: string | null;
  beds: string[];
  calendar: {
    reservedDates: string[];
    calStartDate: string;
    calEndDate: string;
    reservablePeriod: string;
    holidays: (0 | 1 | 2 | 3 | 4 | 5 | 6)[];
    minDays: number;
    availableWeeks: number;
  } | null;
};
