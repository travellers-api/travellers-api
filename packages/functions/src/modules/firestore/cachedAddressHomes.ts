/* eslint-disable-next-line import/no-unresolved */
import { QuerySnapshot } from 'firebase-admin/firestore';
import { Home } from '../address/home/types';
import { firestore } from '../firebase';

const collection = firestore.collection('cachedAddressHomes');

export const setHome = async (id: string, data: Home): Promise<void> => {
  await collection.doc(id).set(data);
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
