import { firestore } from '../../firebase';
import { CachedCircleHome } from './types';

const collection = firestore.collection('cachedCircleHomes');

export const setHome = async (id: string, data: CachedCircleHome): Promise<void> => {
  await collection.doc(id).set(data);
};
