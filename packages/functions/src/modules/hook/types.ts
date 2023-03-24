import { Home } from '../address/home/types';
import { CachedCircleHome } from '../firestore/cachedCircleHomes/types';

export type Hook =
  | {
      type: 'address.home.create';
      data: {
        id: Home['id'];
        name: Home['name'];
      };
    }
  | {
      type: 'address.home.delete';
      data: {
        id: Home['id'];
        name: Home['name'];
      };
    }
  | {
      type: 'circle.home.create';
      data: {
        id: CachedCircleHome['id'];
        name: CachedCircleHome['name'];
      };
    }
  | {
      type: 'circle.home.delete';
      data: {
        id: CachedCircleHome['id'];
        name: CachedCircleHome['name'];
      };
    };
