import { onRequest } from 'firebase-functions/v2/https';
import { addAddressMailWorkersRequest } from '../../modules/firestore/addressMailWorkersRequests';
import { addressMailWorkersRequestZod } from '../../modules/firestore/addressMailWorkersRequests/types';
import { defaultRegion } from '../../modules/functions/constants';

export const mailWorkersApi = onRequest(
  {
    region: defaultRegion,
    secrets: ['ADDRESS_MAIL_WORKERS_SECRET'],
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).end();
      return;
    }

    if (req.header('X-MAIL-WORKERS-SECRET') !== process.env.ADDRESS_MAIL_WORKERS_SECRET) {
      res.status(401).end();
      return;
    }

    const addressMail = await addressMailWorkersRequestZod.parseAsync(req.body).catch(() => null);
    if (addressMail === null) {
      res.status(400).end();
      return;
    }
    await addAddressMailWorkersRequest(addressMail);

    res.status(201).end();
    return;
  }
);
