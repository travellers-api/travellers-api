import { Home } from '@travellers-api/address-fetcher/lib/core/home/types';
import { DocumentSnapshot, QuerySnapshot } from 'firebase-admin/firestore';
import { firestore } from '../../firebase';

export const collectionId = 'cachedAddressHomes';

const collection = firestore.collection(collectionId);

export const setHome = async (id: number, data: Home): Promise<void> => {
  await collection.doc(id.toString()).set(data);
};

export const setHomePartial = async (id: number, data: Partial<Home>): Promise<void> => {
  await collection.doc(id.toString()).set(data, { merge: true });
};

export const deleteHome = async (id: number): Promise<void> => {
  await collection.doc(id.toString()).delete();
};

export const getHomes = async (): Promise<{ id: number; data: Home }[]> => {
  const querySnapshot = (await collection.get()) as QuerySnapshot<Home>;
  return querySnapshot.docs.map((snapshot) => ({
    id: Number(snapshot.id),
    data: snapshot.data(),
  }));
};

export const getHome = async (id: number): Promise<Home | null> => {
  const snapshot = (await collection.doc(id.toString()).get()) as DocumentSnapshot<Home>;
  const data = snapshot.data();
  if (!data) return null;
  return data as Home;
};
