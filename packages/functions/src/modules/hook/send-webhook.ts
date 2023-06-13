import { PubSub } from '@google-cloud/pubsub';
import { Hook, SendWebhookMessage } from './types';

const pubsub = new PubSub();

export const topicName = 'send-webhook';

export const publishSendWebhooks = async (hook: Hook, requests: SendWebhookMessage['request'][]) => {
  const topic = pubsub.topic(topicName);

  await Promise.all(
    requests.map(async (request) => {
      const json: SendWebhookMessage = { hook, request };
      await topic.publishMessage({ json });
    })
  );
};
