export const cookieStringToMap = (cookie: string): Map<string, string> => {
  const cookieMap = new Map();
  cookie
    .split('; ')
    .filter(Boolean)
    .forEach((cookie) => {
      const [key, value] = cookie.split('=');
      key && value && cookieMap.set(key, value);
    });
  return cookieMap;
};

export const setCookieStringToMap = (setCookie: string): Map<string, string> => {
  const cookieMap = new Map();
  const matches = setCookie.match(/[^\s()<>@,;:\\"/[\]?={}]+=[^\s,;\\]+/g) || [];
  matches.forEach((cookie) => {
    const [, key, value] = cookie.match('^(.+)=(.+)$') || [];
    if (!key || !value) {
      return;
    }
    if (
      ['Expires', 'Max', 'Domain', 'Path', 'Secure', 'HttpOnly', 'SameSite', 'auth_pass', 'Max-Age'].some(
        (_key) => _key.toLowerCase() === key.toLowerCase()
      )
    ) {
      return;
    }
    cookieMap.set(key, value);
  });
  return cookieMap;
};

export const mergeCookie = (setCookie: string | null, cookie = ''): string => {
  const cookieMap = new Map([...cookieStringToMap(cookie), ...setCookieStringToMap(setCookie || '')]);
  return Array.from(cookieMap.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');
};
