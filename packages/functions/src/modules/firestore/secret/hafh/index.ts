import { firestore } from '../../../firebase';
import { HafhSecret } from './types';

export const getSecret = async (screenName: string): Promise<HafhSecret> => {
  const screenNameDocumentSnapshot = await firestore.collection('screenNames').doc(screenName).get();
  if (!screenNameDocumentSnapshot.exists) throw new Error('not found');
  const uid = screenNameDocumentSnapshot.get('uid');

  const userSecretDocumentSnapshot = await firestore.collection('userSecrets').doc(uid).get();
  if (!userSecretDocumentSnapshot.exists) throw new Error('not found');
  const secret = userSecretDocumentSnapshot.get('hafh');

  return secret;
};

export const updateSecret = async (screenName: string, secret: Partial<HafhSecret>): Promise<void> => {
  const screenNameDocumentSnapshot = await firestore.collection('screenNames').doc(screenName).get();
  if (!screenNameDocumentSnapshot.exists) throw new Error('not found');
  const uid = screenNameDocumentSnapshot.get('uid');

  const dataObj: Partial<Record<`hafh.${keyof HafhSecret}`, string>> = {};
  const keys: (keyof HafhSecret)[] = ['email', 'password', 'id', 'token'];
  keys.forEach((key) => {
    if (key in secret) {
      dataObj[`hafh.${key}`] = secret[key];
    }
  });

  await firestore.collection('userSecrets').doc(uid).update(dataObj);
};
