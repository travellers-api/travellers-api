import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import { userAgent } from '../../modules/client/user-agent';
import { getWebhooks } from '../../modules/firestore/webhooks';
import { topicName as dispatchHookTopicName } from '../../modules/hook/dispatch-hook';
import { publishSendWebhooks, topicName as sendWebhookTopicName } from '../../modules/hook/send-webhook';
import { DispatchHookMessage, SendWebhookMessage } from '../../modules/hook/types';
import { defaultRegion } from './../../modules/functions/constants';

export const onDispatchHookMessage = functions
  .region(defaultRegion)
  .pubsub.topic(dispatchHookTopicName)
  .onPublish(async (message) => {
    const hook = message.json as DispatchHookMessage;
    const urls = await getWebhooks(hook.topic);
    await publishSendWebhooks(hook, urls);
  });

export const onSendWebhookMessage = functions
  .region(defaultRegion)
  .pubsub.topic(sendWebhookTopicName)
  .onPublish(async (message) => {
    const { url, hook } = message.json as SendWebhookMessage;
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgent,
      },
      body: JSON.stringify(hook),
    });
  });
