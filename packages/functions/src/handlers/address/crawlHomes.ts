import { getNewestHomes } from '@travellers-api/address-fetcher/lib/core/newest-homes';
import * as functions from 'firebase-functions';
import * as pLimit from 'p-limit';
import { ADDRESS_HOME_MAX_LIST_COUNT } from '../../constants/address';
import { dayjs } from '../../lib/dayjs';
import { generateNumbers, getCookieByUid } from '../../modules/address';
import { setHomeBase } from '../../modules/firestore/cachedAddressHomes';
import { defaultRegion } from '../../modules/functions/constants';

const limit = pLimit(1);

// 拠点リスト(30件)ごとに15分に1回、拠点の基本情報を取得
export const crawlHomes = functions
  .region(defaultRegion)
  .pubsub.schedule('* * * * *')
  .onRun(async (context) => {
    const loopMinutes = 30;
    const now = dayjs(context.timestamp).tz('Asia/Tokyo');
    const pageIds = generateNumbers(now, ADDRESS_HOME_MAX_LIST_COUNT, loopMinutes);

    console.log(JSON.stringify({ groupIds: pageIds }));

    const cookie = await getCookieByUid('amon');
    await Promise.all(pageIds.map((id) => single(id, cookie)));
  });

const single = async (pageId: number, cookie: string) => {
  const homes = await limit(() => getNewestHomes(cookie, pageId)).catch((e: Error) => e);
  if (homes instanceof Error) {
    console.error(homes.message);
    return;
  }
  await Promise.all(homes.map((home) => setHomeBase(home.id, home)));
};
