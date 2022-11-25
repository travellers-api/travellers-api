import * as functions from 'firebase-functions';
import { addressApp } from './handlers/address';

export const address = functions.region('asia-northeast1').https.onRequest(addressApp);
