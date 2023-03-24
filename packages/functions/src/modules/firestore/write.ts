import * as functions from 'firebase-functions';

export const getWriteType = (
  change: functions.Change<functions.firestore.DocumentSnapshot>
): 'create' | 'update' | 'delete' => {
  const beforeExists = change.before.exists;
  const afterExists = change.after.exists;

  if (!beforeExists && afterExists) {
    return 'create';
  }
  if (beforeExists && !afterExists) {
    return 'delete';
  }
  return 'update';
};
