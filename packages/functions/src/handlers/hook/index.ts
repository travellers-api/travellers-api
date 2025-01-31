import { onMessagePublished } from "firebase-functions/pubsub";
import { userAgent } from "../../modules/client/user-agent";
import { getWebhooks } from "../../modules/firestore/webhooks";
import { topicName as dispatchHookTopicName } from "../../modules/hook/dispatch-hook";
import {
  publishSendWebhooks,
  topicName as sendWebhookTopicName,
} from "../../modules/hook/send-webhook";
import {
  DispatchHookMessage,
  SendWebhookMessage,
} from "../../modules/hook/types";
import { defaultRegion } from "./../../modules/functions/constants";

export const onDispatchHookMessageV2 = onMessagePublished(
  { topic: dispatchHookTopicName, region: defaultRegion },
  async (event) => {
    const hook = event.data.message.json as DispatchHookMessage;
    const requests = await getWebhooks(hook.topic);
    await publishSendWebhooks(hook, requests);
  },
);

export const onSendWebhookMessageV2 = onMessagePublished(
  { topic: sendWebhookTopicName, region: defaultRegion },
  async (event) => {
    const { hook, request } = event.data.message.json as SendWebhookMessage;
    await fetch(request.url, {
      method: "POST",
      headers: {
        ...request.headers,
        "Content-Type": "application/json",
        "User-Agent": userAgent,
      },
      body: JSON.stringify(hook),
    });
  },
);
