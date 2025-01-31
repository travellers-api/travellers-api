import { Home } from "@travellers-api/address-fetcher/lib/core/home/types";

export type Hook =
  | {
      topic: "address.home.create";
      data: {
        id: Home["id"];
        name: Home["name"];
      };
    }
  | {
      topic: "address.home.delete";
      data: {
        id: Home["id"];
        name: Home["name"];
      };
    }
  | {
      topic: "system.address.calendar.update";
    };

export type DispatchHookMessage = Hook;

export type SendWebhookMessage = {
  hook: Hook;
  request: {
    url: string;
    headers?: Record<string, string>;
  };
};
