/* eslint-disable-next-line import/no-unresolved */
import { DocumentSnapshot } from 'firebase-admin/firestore';
import { firestore } from '../../firebase';
import { CachedAddressRoom } from './types';

export const collectionId = 'cachedCircleHomes';

const collection = firestore.collection(collectionId);

export const updateRoom = async (id: string, data: CachedAddressRoom): Promise<void> => {
  await collection.doc(id).set(data, { merge: true });
};

export const getRoom = async (id: string): Promise<CachedAddressRoom> => {
  const snapshot = (await collection.doc(id).get()) as DocumentSnapshot<CachedAddressRoom>;
  return snapshot.data() || {};
};
