import { QuerySnapshot } from 'firebase-admin/firestore';
import { firestore } from '../../firebase';
import { CachedCircleHome } from './types';

export const collectionId = 'cachedCircleHomes';

const collection = firestore.collection(collectionId);

export const setHome = async (id: string, data: CachedCircleHome): Promise<void> => {
  await collection.doc(id).set(data);
};

export const getHomes = async (): Promise<{ id: string; data: CachedCircleHome }[]> => {
  const querySnapshot = (await collection.get()) as QuerySnapshot<CachedCircleHome>;
  return querySnapshot.docs.map((snapshot) => ({
    id: snapshot.id,
    data: snapshot.data(),
  }));
};

export const deleteHome = async (id: string): Promise<void> => {
  await collection.doc(id).delete();
};
