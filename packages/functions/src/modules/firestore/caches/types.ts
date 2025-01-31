import { CachedAddressHome } from "../cachedAddressHomes/types";

export type AddressCalendar = {
  homes: Omit<CachedAddressHome, "address">[];
};
