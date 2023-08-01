import { CollectionReference } from 'firebase-admin/firestore';
import { firestore } from '../../firebase';
import { AddressMailWorkersRequest } from './types';

export const collectionId = 'addressMailWorkersRequest';

const collection = firestore.collection(collectionId) as CollectionReference<AddressMailWorkersRequest>;

export const addAddressMailWorkersRequest = async (data: AddressMailWorkersRequest): Promise<void> => {
  await collection.doc().set(data);
};
