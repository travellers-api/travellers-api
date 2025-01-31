import { notFoundMessage } from "@travellers-api/address-fetcher/lib/constants";
import { getHome } from "@travellers-api/address-fetcher/lib/core/home";
import { onSchedule } from "firebase-functions/scheduler";
import pLimit from "p-limit";
import { ADDRESS_HOME_MAX_ID } from "../../constants/address";
import { dayjs } from "../../lib/dayjs";
import { generateNumbers, getCookieByUid } from "../../modules/address";
import {
  deleteHome,
  existsHome,
  setHomeAddress,
} from "../../modules/firestore/cachedAddressHomes";
import { defaultRegion } from "../../modules/functions/constants";

const limit = pLimit(1);

// 各拠点ごとに1日に2回、存在チェックと住所取得を実行
export const crawlHomesSingleV2 = onSchedule(
  { schedule: "* * * * *", region: defaultRegion },
  async (event) => {
    const loopMinutes = 720;
    const now = dayjs(event.scheduleTime).tz("Asia/Tokyo");
    const homeIds = generateNumbers(now, ADDRESS_HOME_MAX_ID, loopMinutes);

    console.log(JSON.stringify({ homeIds }));

    const cookie = await getCookieByUid("amon");
    await Promise.all(homeIds.map((id) => single(id, cookie)));
  },
);

const single = async (homeId: number, cookie: string) => {
  const exists = await existsHome(homeId);

  const home = await limit(() => getHome(homeId, cookie)).catch(
    (e: Error) => e,
  );
  if (home instanceof Error && home.message === notFoundMessage) {
    if (exists) await deleteHome(homeId);
    return;
  }
  if (home instanceof Error) {
    console.error(home.message);
    return;
  }

  if (!exists) return;

  const { address } = home;
  await setHomeAddress(homeId, { address });
};
