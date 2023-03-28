import fetch from 'node-fetch';
import { userAgent } from '../../constants';
import { verifyPassword, getAccountInfo } from './fetchers';

export const getIdAndToken = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ id: string; token: string }> => {
  const verifyPasswordRes = await verifyPassword(email, password);
  const getAccountInfoRes = await getAccountInfo(verifyPasswordRes.idToken);

  return {
    id: getAccountInfoRes.users[0]?.localId ?? '',
    token: verifyPasswordRes.idToken,
  };
};

export const checkValidityToken = async (id: string, token: string): Promise<boolean> => {
  const res = await fetch(`https://www.hafh.com/api/neighbors/${id}`, {
    headers: {
      authorization: `Bearer ${token}`,
      'User-Agent': userAgent,
    },
  });
  return res.status === 200;
};
