import { CollectionReference } from 'firebase-admin/firestore';
import { firestore } from '../../firebase';
import { CachedAddressHome } from './types';

export const collectionId = 'cachedAddressHomes';

const collection = firestore.collection(collectionId) as CollectionReference<CachedAddressHome>;

export const setHome = async (id: number, data: CachedAddressHome): Promise<void> => {
  await collection.doc(id.toString()).set(data);
};

export const setHomePartial = async (id: number, data: Partial<CachedAddressHome>): Promise<void> => {
  await collection.doc(id.toString()).set(data, { merge: true });
};

export const deleteHome = async (id: number): Promise<void> => {
  await collection.doc(id.toString()).delete();
};

export const getHomes = async (): Promise<{ id: number; data: CachedAddressHome }[]> => {
  const querySnapshot = await collection.get();
  return querySnapshot.docs.map((snapshot) => ({
    id: Number(snapshot.id),
    data: snapshot.data(),
  }));
};

export const getHome = async (id: number): Promise<CachedAddressHome | null> => {
  const snapshot = await collection.doc(id.toString()).get();
  const data = snapshot.data();
  if (!data) return null;
  return data;
};
