import { DocumentSnapshot } from 'firebase-admin/firestore';
import { firestore } from '../../firebase';
import { AddressCalendar } from './types';

export const collectionId = 'caches';

const collection = firestore.collection(collectionId);

export const setAddressCalendarCache = async (data: AddressCalendar): Promise<void> => {
  await collection.doc('address-calendar').set(data);
};

export const getAddressCalendarCache = async (): Promise<AddressCalendar> => {
  const snapshot = (await collection.doc('address-calendar').get()) as DocumentSnapshot<AddressCalendar>;
  const data = snapshot.data();
  if (!data) throw new Error();
  return data;
};
