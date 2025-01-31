import { QuerySnapshot } from "firebase-admin/firestore";
import { firestore } from "../../firebase";
import { Hook } from "../../hook/types";
import { Webhook } from "./types";

export const collectionId = "webhooks";

const collection = firestore.collection(collectionId);

export const getWebhooks = async (
  topic: Hook["topic"],
): Promise<Pick<Webhook, "url" | "headers">[]> => {
  const querySnapshot = (await collection
    .where("topics", "array-contains", topic)
    .get()) as QuerySnapshot<Webhook>;
  return querySnapshot.docs.map((snapshot) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { topics, ...data } = snapshot.data();
    return data;
  });
};
