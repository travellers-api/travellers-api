import { fetchCookie } from './fetchers';

export const getCookie = async (aikotoba: string): Promise<string> => {
  const cookie = await fetchCookie(aikotoba);
  return cookie;
};
