import { Home } from '@traveller-api/address-fetcher/lib/core/home/types';
import { DocumentSnapshot, QuerySnapshot } from 'firebase-admin/firestore';
import { firestore } from '../../firebase';

export const collectionId = 'cachedAddressHomes';

const collection = firestore.collection(collectionId);

export const setHome = async (id: string, data: Home): Promise<void> => {
  await collection.doc(id).set(data);
};

export const setHomePartial = async (id: string, data: Partial<Home>): Promise<void> => {
  await collection.doc(id).set(data, { merge: true });
};

export const deleteHome = async (id: string): Promise<void> => {
  await collection.doc(id).delete();
};

export const getHomes = async (): Promise<{ id: string; data: Home }[]> => {
  const querySnapshot = (await collection.get()) as QuerySnapshot<Home>;
  return querySnapshot.docs.map((snapshot) => ({
    id: snapshot.id,
    data: snapshot.data(),
  }));
};

export const getHome = async (id: string): Promise<Home | null> => {
  const snapshot = (await collection.doc(id).get()) as DocumentSnapshot<Home>;
  const data = snapshot.data();
  if (!data) return null;
  return data as Home;
};
