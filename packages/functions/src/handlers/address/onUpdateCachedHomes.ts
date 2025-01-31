import { Home } from "@travellers-api/address-fetcher/lib/core/home/types";
import { onDocumentWritten } from "firebase-functions/firestore";
import { pick } from "lodash";
import { z } from "zod";
import { collectionId } from "../../modules/firestore/cachedAddressHomes";
import { getWriteType } from "../../modules/firestore/write";
import { defaultRegion } from "../../modules/functions/constants";
import { publishDispatchHook } from "../../modules/hook/dispatch-hook";

const homeZod = z.object({
  id: z.number(),
  name: z.string(),
});

export const onUpdateCachedHomesV2 = onDocumentWritten(
  { document: `/${collectionId}/{id}`, region: defaultRegion },
  async (event) => {
    if (!event.data) throw new Error("No data");

    const type = getWriteType(event.data);

    switch (type) {
      case "create": {
        const home = event.data.after.data() as Home;
        const data = pick(home, ["id", "name"]);

        try {
          homeZod.parse(data);
        } catch (e) {
          console.error(e);
          break;
        }

        await publishDispatchHook({
          topic: "address.home.create",
          data,
        });
        break;
      }

      case "delete": {
        const home = event.data.before.data() as Home;
        const data = pick(home, ["id", "name"]);

        try {
          homeZod.parse(data);
        } catch (e) {
          console.error(e);
          break;
        }

        await publishDispatchHook({
          topic: "address.home.delete",
          data,
        });
        break;
      }
    }
  },
);
