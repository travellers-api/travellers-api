import { firestore } from '../../../firebase';
import { AddressSecret } from './types';

export const getSecret = async (screenName: string): Promise<AddressSecret> => {
  const screenNameDocumentSnapshot = await firestore.collection('screenNames').doc(screenName).get();
  if (!screenNameDocumentSnapshot.exists) throw new Error('not found');
  const uid = screenNameDocumentSnapshot.get('uid');

  const userSecretDocumentSnapshot = await firestore.collection('userSecrets').doc(uid).get();
  if (!userSecretDocumentSnapshot.exists) throw new Error('not found');
  const secret = userSecretDocumentSnapshot.get('address');

  return secret;
};

export const updateSecret = async (screenName: string, secret: Partial<AddressSecret>): Promise<void> => {
  const screenNameDocumentSnapshot = await firestore.collection('screenNames').doc(screenName).get();
  if (!screenNameDocumentSnapshot.exists) throw new Error('not found');
  const uid = screenNameDocumentSnapshot.get('uid');

  const dataObj: Partial<Record<`address.${keyof AddressSecret}`, string>> = {};
  const keys: (keyof AddressSecret)[] = ['email', 'password', 'cookie'];
  keys.forEach((key) => {
    if (key in secret) {
      dataObj[`address.${key}`] = secret[key];
    }
  });

  await firestore.collection('userSecrets').doc(uid).update(dataObj);
};
