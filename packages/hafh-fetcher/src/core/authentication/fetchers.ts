import fetch from 'node-fetch';
import { userAgent } from '../../constants';
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
