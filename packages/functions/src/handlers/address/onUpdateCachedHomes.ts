import * as functions from 'firebase-functions';
import { pick } from 'lodash';
import { Home } from '../../modules/address/home/types';
import { collectionId } from '../../modules/firestore/cachedAddressHomes';
import { getWriteType } from '../../modules/firestore/write';
import { defaultRegion } from '../../modules/functions/constants';
import { publishHook } from '../../modules/hook';

export const onUpdateCachedHomes = functions
  .region(defaultRegion)
  .firestore.document(`/${collectionId}/{id}`)
  .onWrite(async (change) => {
    const type = getWriteType(change);

    if (type === 'create') {
      const home = change.after.data() as Home;
      await publishHook({
        type: 'address.home.create',
        data: pick(home, ['id', 'name']),
      });
      return;
    }
    if (type === 'delete') {
      const home = change.before.data() as Home;
      await publishHook({
        type: 'address.home.delete',
        data: pick(home, ['id', 'name']),
      });
      return;
    }
  });
