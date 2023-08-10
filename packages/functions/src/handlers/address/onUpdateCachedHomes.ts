import { Home } from '@travellers-api/address-fetcher/lib/core/home/types';
import * as functions from 'firebase-functions';
import { pick } from 'lodash';
import { z } from 'zod';
import { collectionId } from '../../modules/firestore/cachedAddressHomes';
import { getWriteType } from '../../modules/firestore/write';
import { defaultRegion } from '../../modules/functions/constants';
import { publishDispatchHook } from '../../modules/hook/dispatch-hook';

const homeZod = z.object({
  id: z.string(),
  name: z.string(),
});

export const onUpdateCachedHomes = functions
  .region(defaultRegion)
  .firestore.document(`/${collectionId}/{id}`)
  .onWrite(async (change) => {
    const type = getWriteType(change);

    switch (type) {
      case 'create': {
        const home = change.after.data() as Home;
        const data = pick(home, ['id', 'name']);

        try {
          homeZod.parse(data);
        } catch (e) {
          console.error(e);
          break;
        }

        await publishDispatchHook({
          topic: 'address.home.create',
          data,
        });
        break;
      }

      case 'delete': {
        const home = change.before.data() as Home;
        const data = pick(home, ['id', 'name']);

        try {
          homeZod.parse(data);
        } catch (e) {
          console.error(e);
          break;
        }

        await publishDispatchHook({
          topic: 'address.home.delete',
          data,
        });
        break;
      }
    }
  });
