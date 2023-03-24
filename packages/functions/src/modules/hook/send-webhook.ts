import { PubSub } from '@google-cloud/pubsub';
import { Hook, SendWebhookMessage } from './types';

const pubsub = new PubSub();

export const topicName = 'send-webhook';

export const publishSendWebhooks = async (hook: Hook, urls: string[]) => {
  const topic = pubsub.topic(topicName);

  await Promise.all(
    urls.map(async (url) => {
      const json: SendWebhookMessage = { url, hook };
      await topic.publishMessage({ json });
    })
  );
};
