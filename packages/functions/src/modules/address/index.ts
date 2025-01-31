import { getCookie } from "@travellers-api/address-fetcher/lib/core/authentication";
import { dayjs } from "../../lib/dayjs";
import { getSecret, updateSecret } from "../firestore/secret/address";

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

export const generateNumbers = (
  now: dayjs.Dayjs,
  maxCount: number,
  loopMinutes: number,
): number[] => {
  const minutesOfDay = now.hour() * 60 + now.minute();
  const count = Math.ceil(maxCount / loopMinutes);
  const baseId = (minutesOfDay % loopMinutes) * count + 1;
  const numbers = [...new Array(count)]
    .map((_, i) => baseId + i)
    .filter((id) => id <= maxCount);
  return numbers;
};
