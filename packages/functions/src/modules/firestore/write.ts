import { Change, DocumentSnapshot } from "firebase-functions/firestore";

export const getWriteType = (
  change: Change<DocumentSnapshot>,
): "create" | "update" | "delete" => {
  const beforeExists = change.before.exists;
  const afterExists = change.after.exists;

  if (!beforeExists && afterExists) {
    return "create";
  }
  if (beforeExists && !afterExists) {
    return "delete";
  }
  return "update";
};
