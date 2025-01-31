import { onSchedule } from "firebase-functions/scheduler";
import { getHomes } from "../../modules/firestore/cachedAddressHomes";
import { setAddressCalendarCache } from "../../modules/firestore/caches";
import { defaultRegion } from "../../modules/functions/constants";
import { publishDispatchHook } from "../../modules/hook/dispatch-hook";

// 毎時0分に生成
export const generateCalendarCacheV2 = onSchedule(
  { schedule: "0 * * * *", region: defaultRegion },
  async () => {
    const homes = await getHomes();

    const json = { homes: homes.map(({ data: { address, ...data } }) => data) };
    await setAddressCalendarCache(json);
    await publishDispatchHook({ topic: "system.address.calendar.update" });
  },
);
