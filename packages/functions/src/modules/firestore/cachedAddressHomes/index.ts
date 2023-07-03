import { CollectionReference } from 'firebase-admin/firestore';
import { firestore } from '../../firebase';
import { CachedAddressHome, CachedAddressHomeBase } from './types';

export const collectionId = 'cachedAddressHomes';

const collection = firestore.collection(collectionId) as CollectionReference<CachedAddressHome>;

export const setHomeBase = async (id: number, data: CachedAddressHomeBase): Promise<void> => {
  await collection.doc(id.toString()).set(data, { merge: true });
};

export const setHomeAddress = async (id: number, data: Pick<CachedAddressHome, 'address'>): Promise<void> => {
  await collection.doc(id.toString()).set(data, { merge: true });
};

export const setHomeRooms = async (id: number, data: Pick<CachedAddressHome, 'rooms'>): Promise<void> => {
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

export const existsHome = async (id: number): Promise<boolean> => {
  const snapshot = await collection.doc(id.toString()).get();
  return snapshot.exists;
};
