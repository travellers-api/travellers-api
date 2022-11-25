import { firestore } from '../firebase';

type AddressSecret = {
  email: string;
  password: string;
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
