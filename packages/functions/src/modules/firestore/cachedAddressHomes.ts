import { Home } from '../address/home/types';
import { firestore } from '../firebase';

const collection = firestore.collection('cachedAddressHomes');

export const setHome = async (id: string, data: Home): Promise<void> => {
  await collection.doc(id).set(data);
};

export const deleteHome = async (id: string): Promise<void> => {
  await collection.doc(id).delete();
};
