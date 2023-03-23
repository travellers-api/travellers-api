export const cookieStringToMap = (cookie: string): Map<string, string> => {
  const cookieMap = new Map();
  cookie
    .split(';')
    .filter(Boolean)
    .forEach((cookie) => {
      const [key, value] = cookie.trim().split('=');
      key && value && cookieMap.set(key, value);
    });
  return cookieMap;
};

export const setCookieStringToMap = (setCookie: string, ignoreKeys: string[] = []): Map<string, string> => {
  const cookieMap = new Map();
  const matches = setCookie.match(/[^\s()<>@,;:\\"/[\]?={}]+=[^\s,;\\]+/g) || [];
  matches.forEach((cookie) => {
    const [, key, value] = cookie.trim().match('^(.+)=(.+)$') || [];
    if (!key || !value) {
      return;
    }
    if (
      ['Expires', 'Max', 'Domain', 'Path', 'Secure', 'HttpOnly', 'SameSite', ...ignoreKeys].some(
        (_key) => _key.toLowerCase() === key.toLowerCase()
      )
    ) {
      return;
    }
    cookieMap.set(key, value);
  });
  return cookieMap;
};
