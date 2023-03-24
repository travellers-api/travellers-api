import * as functions from 'firebase-functions';
import { addressApp } from './handlers/address';
import { circleApp } from './handlers/circle';
import { crawlAddressHomesHandler } from './handlers/crawlAddressHomes';
import { crawlCircleHomesHandler } from './handlers/crawlCircleHomes';
import { hafhApp } from './handlers/hafh';
import { defaultRegion } from './modules/functions/constants';

export const address = functions.region(defaultRegion).https.onRequest(addressApp);
export const crawlAddressHomes = functions
  .region(defaultRegion)
  .pubsub.schedule('* * * * *')
  .onRun(crawlAddressHomesHandler);

export const circle = functions.region(defaultRegion).https.onRequest(circleApp);
export const crawlCircleHomes = functions
  .region(defaultRegion)
  .runWith({ secrets: ['CIRCLE_AIKOTOBA'] })
  .pubsub.schedule('0 * * * *')
  .onRun(crawlCircleHomesHandler);

export const hafh = functions.region(defaultRegion).https.onRequest(hafhApp);
