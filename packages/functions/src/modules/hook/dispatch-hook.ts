import { PubSub } from '@google-cloud/pubsub';
import { Hook } from './types';

const pubsub = new PubSub();

export const topicName = 'dispatch-hook';

export const publishDispatchHook = async (hook: Hook) => {
  const topic = pubsub.topic(topicName);
  await topic.publishMessage({ json: hook });
};
