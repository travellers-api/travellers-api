import { CollectionReference } from 'firebase-admin/firestore';
import { firestore } from '../../firebase';
import { AddressMail } from './types';

export const collectionId = 'addressMails';

const collection = firestore.collection(collectionId) as CollectionReference<AddressMail>;

export const addAddressMail = async (data: AddressMail): Promise<void> => {
  await collection.doc().set(data);
};
