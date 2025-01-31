import {
  Home,
  Room,
} from "@travellers-api/address-fetcher/lib/core/home/types";

export type CachedAddressHomeBase = Pick<
  Home,
  | "id"
  | "url"
  | "name"
  | "thumbnail"
  | "prefecture"
  | "homeType"
  | "reservationLimit"
>;

export type CachedAddressHome = CachedAddressHomeBase &
  Partial<Pick<Home, "address">> & {
    rooms?: CachedAddressHomeRoom[];
  };

export type CachedAddressHomeRoom = Room & {
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
