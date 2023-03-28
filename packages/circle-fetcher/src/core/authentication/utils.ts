import { cookieStringToMap, setCookieStringToMap } from '../../utils/cookie';
import { ignoreCookieKeys } from './constants';

export const mergeCookie = (setCookie: string | null, cookie = ''): string => {
  const cookieMap = new Map([...cookieStringToMap(cookie), ...setCookieStringToMap(setCookie || '', ignoreCookieKeys)]);
  return Array.from(cookieMap.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');
};
