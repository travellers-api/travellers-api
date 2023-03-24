import { Home } from '../address/home/types';
import { CachedCircleHome } from '../firestore/cachedCircleHomes/types';

export type Hook =
  | {
      topic: 'address.home.create';
      data: {
        id: Home['id'];
        name: Home['name'];
      };
    }
  | {
      topic: 'address.home.delete';
      data: {
        id: Home['id'];
        name: Home['name'];
      };
    }
  | {
      topic: 'circle.home.create';
      data: {
        id: CachedCircleHome['id'];
        name: CachedCircleHome['name'];
      };
    }
  | {
      topic: 'circle.home.delete';
      data: {
        id: CachedCircleHome['id'];
        name: CachedCircleHome['name'];
      };
    };

export type DispatchHookMessage = Hook;

export type SendWebhookMessage = {
  url: string;
  hook: Hook;
};
