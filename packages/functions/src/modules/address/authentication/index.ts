import { fetchToken, fetchCookie } from './fetchers';

export const getCookie = async ({ email, password }: { email: string; password: string }): Promise<string> => {
  const { cookie: baseCookie, authenticityToken } = await fetchToken();
  const cookie = await fetchCookie({
    cookie: baseCookie,
    authenticityToken,
    email,
    password,
  });
  return cookie;
};
