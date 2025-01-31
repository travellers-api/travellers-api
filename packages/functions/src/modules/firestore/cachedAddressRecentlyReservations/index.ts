import { DocumentSnapshot } from "firebase-admin/firestore";
import { firestore } from "../../firebase";
import { CachedAddressRecentlyReservation } from "./types";

export const collectionId = "cachedAddressRecentlyReservations";

const collection = firestore.collection(collectionId);

export const updateRecentlyReservations = async (
  id: number,
  data: CachedAddressRecentlyReservation,
): Promise<void> => {
  await collection.doc(id.toString()).set(data, { merge: true });
};

export const getRecentlyReservation = async (
  id: number,
): Promise<CachedAddressRecentlyReservation> => {
  const snapshot = (await collection
    .doc(id.toString())
    .get()) as DocumentSnapshot<CachedAddressRecentlyReservation>;
  return snapshot.data() || {};
};
