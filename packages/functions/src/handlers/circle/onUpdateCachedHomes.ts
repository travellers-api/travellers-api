import * as functions from 'firebase-functions';
import { pick } from 'lodash';
import { collectionId } from '../../modules/firestore/cachedCircleHomes';
import { CachedCircleHome } from '../../modules/firestore/cachedCircleHomes/types';
import { getWriteType } from '../../modules/firestore/write';
import { defaultRegion } from '../../modules/functions/constants';
import { publishDispatchHook } from '../../modules/hook/dispatch-hook';

export const onUpdateCachedHomes = functions
  .region(defaultRegion)
  .firestore.document(`/${collectionId}/{id}`)
  .onWrite(async (change) => {
    const type = getWriteType(change);

    if (type === 'create') {
      const home = change.after.data() as CachedCircleHome;
      await publishDispatchHook({
        topic: 'circle.home.create',
        data: pick(home, ['id', 'name']),
      });
      return;
    }
    if (type === 'delete') {
      const home = change.before.data() as CachedCircleHome;
      await publishDispatchHook({
        topic: 'circle.home.delete',
        data: pick(home, ['id', 'name']),
      });
      return;
    }
  });
