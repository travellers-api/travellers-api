import { DocumentSnapshot } from 'firebase-admin/firestore';
import { firestore } from '../../firebase';
import { CachedAddressRecentlyReservation } from './types';

export const collectionId = 'cachedAddressRecentlyReservations';

const collection = firestore.collection(collectionId);

export const updateRecentlyReservations = async (id: string, data: CachedAddressRecentlyReservation): Promise<void> => {
  await collection.doc(id).set(data, { merge: true });
};

export const getRecentlyReservation = async (id: string): Promise<CachedAddressRecentlyReservation> => {
  const snapshot = (await collection.doc(id).get()) as DocumentSnapshot<CachedAddressRecentlyReservation>;
  return snapshot.data() || {};
};
