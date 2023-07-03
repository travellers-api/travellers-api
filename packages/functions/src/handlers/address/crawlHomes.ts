import { getHome } from '@travellers-api/address-fetcher/lib/core/home';
import * as functions from 'firebase-functions';
import * as pLimit from 'p-limit';
import { ADDRESS_HOME_MAX_COUNT } from '../../constants/address';
import { dayjs } from '../../lib/dayjs';
import { generateHomeIds, getCookieByUid } from '../../modules/address';
import { deleteHome, setHomeBase } from '../../modules/firestore/cachedAddressHomes';
import { defaultRegion } from '../../modules/functions/constants';

const limit = pLimit(1);

// 1分あたり2拠点, 4時間あたり480拠点クロール
export const crawlHomes = functions
  .region(defaultRegion)
  .pubsub.schedule('* * * * *')
  .onRun(async (context) => {
    const loopMinutes = 240;
    const now = dayjs(context.timestamp).tz('Asia/Tokyo');
    const homeIds = generateHomeIds(now, ADDRESS_HOME_MAX_COUNT, loopMinutes);

    console.log(JSON.stringify({ homeIds }));

    await getHomes(homeIds);
  });

const getHomes = async (homeIds: number[]) => {
  const cookie = await getCookieByUid('amon');

  await Promise.all(
    homeIds.map(async (id) => {
      const home = await limit(() => getHome(id, cookie)).catch((e: Error) => e);
      if (home instanceof Error && home.message === 'not found') {
        await deleteHome(id);
        return;
      }
      if (home instanceof Error) {
        console.error(home.message);
        return;
      }

      const { rooms, ...homeWithoutRooms } = home;
      await setHomeBase(id, homeWithoutRooms);
    })
  );
};
