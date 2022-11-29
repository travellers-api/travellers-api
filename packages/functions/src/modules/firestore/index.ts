import { firestore } from '../firebase';

type AddressSecret = {
  email: string;
  password: string;
  cookie: string;
};

export const getAddressSecret = async (screenName: string): Promise<AddressSecret> => {
  const screenNameDocumentSnapshot = await firestore.collection('screenNames').doc(screenName).get();
  if (!screenNameDocumentSnapshot.exists) throw new Error('not found');
  const uid = screenNameDocumentSnapshot.get('uid');

  const userSecretDocumentSnapshot = await firestore.collection('userSecrets').doc(uid).get();
  if (!userSecretDocumentSnapshot.exists) throw new Error('not found');
  const secret = userSecretDocumentSnapshot.get('address');

  return secret;
};

export const setAddressSecret = async (screenName: string, secret: Partial<AddressSecret>): Promise<void> => {
  const screenNameDocumentSnapshot = await firestore.collection('screenNames').doc(screenName).get();
  if (!screenNameDocumentSnapshot.exists) throw new Error('not found');
  const uid = screenNameDocumentSnapshot.get('uid');

  const dataObj: Partial<Record<`address.${keyof AddressSecret}`, string>> = {};
  Object.entries(secret).forEach(([key, value]) => {
    dataObj[`address.${key as keyof AddressSecret}`] = value;
  });
  await firestore.collection('userSecrets').doc(uid).set(dataObj, { merge: true });
};
