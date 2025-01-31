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
    const { topics, ...data } = snapshot.data();
    return data;
  });
};
