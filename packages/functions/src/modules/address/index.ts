import { getCookie } from '@traveller-api/address-fetcher/lib/core/authentication';
import { getSecret, updateSecret } from '../firestore/secret/address';

export const getCookieByUid = async (uid: string) => {
  const secret = await getSecret(uid);
  const cookie =
    secret.cookie ||
    (await getCookie(secret).then(async (cookie) => {
      await updateSecret(uid, { cookie });
      return cookie;
    }));
  return cookie;
};
