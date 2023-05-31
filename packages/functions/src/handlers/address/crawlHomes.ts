import { getCookie } from '@traveller-api/address-fetcher/lib/core/authentication';
import { getHome } from '@traveller-api/address-fetcher/lib/core/home';
import * as functions from 'firebase-functions';
import { deleteHome, setHomePartial } from '../../modules/firestore/cachedAddressHomes';
import { getSecret, updateSecret } from '../../modules/firestore/secret/address';
import { defaultRegion } from '../../modules/functions/constants';

const MAX_COUNT = 480;

export const crawlHomes = functions
  .region(defaultRegion)
  .pubsub.schedule('* * * * *')
  .onRun(async (context) => {
    const minutes = new Date(context.timestamp).getMinutes();
    const count = Math.floor(MAX_COUNT / 60);
    const baseId = count * minutes + 1;
    const targetIds = [...new Array(count)].map((_, i) => (baseId + i).toString());

    await Promise.all([getHomes(targetIds), getHomesRooms(targetIds)]);
  });

const getCookieByUid = async (uid: string) => {
  const secret = await getSecret(uid);
  const cookie =
    secret.cookie ||
    (await getCookie(secret).then(async (cookie) => {
      await updateSecret(uid, { cookie });
      return cookie;
    }));
  return cookie;
};

const getHomes = async (targetIds: string[]) => {
  // 住所は、本会員のみ取得可能
  const cookie = await getCookieByUid('amon');

  await Promise.all(
    targetIds.map(async (id) => {
      const home = await getHome(id, cookie).catch((e: Error) => e);
      if (home instanceof Error && home.message === 'not found') {
        await deleteHome(id);
        return;
      }
      if (home instanceof Error) {
        console.error(home.message);
        return;
      }

      const { rooms, ...homeWithoutRooms } = home;
      await setHomePartial(id, homeWithoutRooms);
    })
  );
};

const getHomesRooms = async (targetIds: string[]) => {
  // 性別専用部屋を含む予約状況は、メール会員のみ取得可能
  const cookie = await getCookieByUid('bot');

  await Promise.all(
    targetIds.map(async (id) => {
      const home = await getHome(id, cookie).catch((e: Error) => e);
      if (home instanceof Error) {
        return;
      }

      const { rooms } = home;
      await setHomePartial(id, { rooms });
    })
  );
};
