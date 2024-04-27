import * as functions from 'firebase-functions';
import { getHomes } from '../../modules/firestore/cachedAddressHomes';
import { setAddressCalendarCache } from '../../modules/firestore/caches';
import { defaultRegion } from '../../modules/functions/constants';
import { publishDispatchHook } from '../../modules/hook/dispatch-hook';

// 毎時0分に生成
export const generateCalendarCache = functions
  .region(defaultRegion)
  .pubsub.schedule('0 * * * *')
  .onRun(async () => {
    const homes = await getHomes();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const json = { homes: homes.map(({ data: { address, ...data } }) => data) };
    await setAddressCalendarCache(json);
    await publishDispatchHook({ topic: 'system.address.calendar.update' });
  });
