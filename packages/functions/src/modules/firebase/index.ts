/* eslint-disable-next-line import/no-unresolved */
import { initializeApp } from 'firebase-admin/app';
/* eslint-disable-next-line import/no-unresolved */
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp();

export const firestore = getFirestore(app);
