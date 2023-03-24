import { PubSub } from '@google-cloud/pubsub';
import { DispatchHookMessage, Hook } from './types';

const pubsub = new PubSub();

export const topicName = 'dispatch-hook';

export const publishDispatchHook = async (hook: Hook) => {
  const topic = pubsub.topic(topicName);
  const json: DispatchHookMessage = hook;
  await topic.publishMessage({ json });
};
