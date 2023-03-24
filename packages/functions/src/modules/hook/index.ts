import { PubSub } from '@google-cloud/pubsub';
import { Hook } from './types';

const pubsub = new PubSub();

export const publishHook = async (hook: Hook) => {
  const topic = pubsub.topic('hook');
  await topic.publishMessage({ json: hook });
};
