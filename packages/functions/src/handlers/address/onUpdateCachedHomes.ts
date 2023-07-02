import { Home } from '@travellers-api/address-fetcher/lib/core/home/types';
import * as functions from 'firebase-functions';
import { pick } from 'lodash';
import { collectionId } from '../../modules/firestore/cachedAddressHomes';
import { getWriteType } from '../../modules/firestore/write';
import { defaultRegion } from '../../modules/functions/constants';
import { publishDispatchHook } from '../../modules/hook/dispatch-hook';

export const onUpdateCachedHomes = functions
  .region(defaultRegion)
  .firestore.document(`/${collectionId}/{id}`)
  .onWrite(async (change) => {
    const type = getWriteType(change);

    if (type === 'create') {
      const home = change.after.data() as Home;
      await publishDispatchHook({
        topic: 'address.home.create',
        data: pick(home, ['id', 'name']),
      });
      return;
    }
    if (type === 'delete') {
      const home = change.before.data() as Home;
      await publishDispatchHook({
        topic: 'address.home.delete',
        data: pick(home, ['id', 'name']),
      });
      return;
    }
  });
