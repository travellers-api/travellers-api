import * as functions from 'firebase-functions';
import { addressApp } from './handlers/address';
import { crawlAddressHomesHandler } from './handlers/crawlAddressHomes';

export const address = functions.region('asia-northeast1').https.onRequest(addressApp);
export const crawlAddressHomes = functions
  .region('asia-northeast1')
  .pubsub.schedule('* * * * *')
  .onRun(crawlAddressHomesHandler);
