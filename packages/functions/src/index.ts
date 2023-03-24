import * as functions from 'firebase-functions';
import { addressApp } from './handlers/address/address';
import { crawlAddressHomesHandler } from './handlers/address/crawlAddressHomes';
import { circleApp } from './handlers/circle/circle';
import { crawlCircleHomesHandler } from './handlers/circle/crawlCircleHomes';
import { hafhApp } from './handlers/hafh/hafh';
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
