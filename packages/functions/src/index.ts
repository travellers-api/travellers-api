import * as functions from 'firebase-functions';
import { addressApp } from './handlers/address';
import { crawlAddressHomesHandler } from './handlers/crawlAddressHomes';
import { crawlCircleHomesHandler } from './handlers/crawlCircleHomes';

export const address = functions.region('asia-northeast1').https.onRequest(addressApp);
export const crawlAddressHomes = functions
  .region('asia-northeast1')
  .pubsub.schedule('* * * * *')
  .onRun(crawlAddressHomesHandler);
export const crawlCircleHomes = functions
  .region('asia-northeast1')
  .runWith({ secrets: ['CIRCLE_AIKOTOBA'] })
  .pubsub.schedule('0 * * * *')
  .onRun(crawlCircleHomesHandler);
