import { firestore } from "../../firebase";
import { AddressCalendar } from "./types";

export const collectionId = "caches";

const collection = firestore.collection(collectionId);

export const setAddressCalendarCache = async (
  data: AddressCalendar,
): Promise<void> => {
  await collection.doc("address-calendar").set({ json: JSON.stringify(data) });
};

export const getAddressCalendarCache = async (): Promise<AddressCalendar> => {
  const snapshot = await collection.doc("address-calendar").get();
  const data = snapshot.data();
  console.log(data);
  if (!data) throw new Error();
  return JSON.parse(data.json) as AddressCalendar;
};
