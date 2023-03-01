/* eslint-disable-next-line import/no-unresolved */
import { QuerySnapshot } from 'firebase-admin/firestore';
import { firestore } from '../../firebase';
import { CachedCircleHome } from './types';

const collection = firestore.collection('cachedCircleHomes');

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
