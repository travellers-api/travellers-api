import fetch from 'node-fetch';
import { userAgent } from '../../client/user-agent';
import { GetAccountInfoResponse, VerifyPasswordResponse } from './types';

const key = 'AIzaSyCSllyHGPz2FNhRXnfDSpJ8M_NQAthIb-g';

export const verifyPassword = async (email: string, password: string): Promise<VerifyPasswordResponse> => {
  const url = new URL('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword');
  url.searchParams.append('key', key);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': userAgent,
    },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  });
  const json = (await res.json()) as VerifyPasswordResponse;
  return json;
};

export const getAccountInfo = async (idToken: string): Promise<GetAccountInfoResponse> => {
  const url = new URL('https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo');
  url.searchParams.append('key', key);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': userAgent,
    },
    body: JSON.stringify({
      idToken,
    }),
  });
  const json = (await res.json()) as GetAccountInfoResponse;
  return json;
};

export const checkValidityToken = async (id: string, token: string): Promise<boolean> => {
  const res = await fetch(`https://www.hafh.com/api/neighbors/${id}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  return res.status === 200;
};
