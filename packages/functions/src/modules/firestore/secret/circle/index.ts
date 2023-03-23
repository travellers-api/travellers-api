import { firestore } from '../../../firebase';
import { CircleSecret } from './types';

export const getSecret = async (screenName: string): Promise<CircleSecret> => {
  const screenNameDocumentSnapshot = await firestore.collection('screenNames').doc(screenName).get();
  if (!screenNameDocumentSnapshot.exists) throw new Error('not found');
  const uid = screenNameDocumentSnapshot.get('uid');

  const userSecretDocumentSnapshot = await firestore.collection('userSecrets').doc(uid).get();
  if (!userSecretDocumentSnapshot.exists) throw new Error('not found');
  const secret = userSecretDocumentSnapshot.get('circle');

  return secret;
};

export const updateSecret = async (screenName: string, secret: Partial<CircleSecret>): Promise<void> => {
  const screenNameDocumentSnapshot = await firestore.collection('screenNames').doc(screenName).get();
  if (!screenNameDocumentSnapshot.exists) throw new Error('not found');
  const uid = screenNameDocumentSnapshot.get('uid');

  const dataObj: Partial<Record<`circle.${keyof CircleSecret}`, string>> = {};
  const keys: (keyof CircleSecret)[] = ['email', 'password', 'cookie'];
  keys.forEach((key) => {
    if (key in secret) {
      dataObj[`circle.${key}`] = secret[key];
    }
  });

  await firestore.collection('userSecrets').doc(uid).update(dataObj);
};
