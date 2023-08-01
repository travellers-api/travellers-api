import { onRequest } from 'firebase-functions/v2/https';
import { simpleParser } from 'mailparser';
import { z } from 'zod';
import { addAddressMailWorkersRequest } from '../../modules/firestore/addressMailWorkersRequests';
import { defaultRegion } from '../../modules/functions/constants';

const bodySchema = z.object({
  from: z.string(),
  to: z.string(),
  raw: z.string(),
});

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

    const addressMail = await bodySchema.parseAsync(req.body).catch(() => null);
    if (addressMail === null) {
      res.status(400).end();
      return;
    }

    const parsed = await simpleParser(addressMail.raw);
    await addAddressMailWorkersRequest({ ...addressMail, parsed });

    res.status(201).end();
    return;
  }
);
