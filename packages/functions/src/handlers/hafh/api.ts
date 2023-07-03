import { checkValidityToken, getIdAndToken } from '@travellers-api/hafh-fetcher/lib/core/authentication';
import { getReservations } from '@travellers-api/hafh-fetcher/lib/core/reservation';
import { Reservation } from '@travellers-api/hafh-fetcher/lib/core/reservation/types';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { getSecret, updateSecret } from '../../modules/firestore/secret/hafh';
import { defaultRegion } from '../../modules/functions/constants';

const app = express();

app.get<
  {
    screenName: string;
  },
  {
    reservations: Reservation[];
  }
>('/hafh/users/:screenName/reservations', async (req, res) => {
  try {
    const { screenName } = req.params;
    const secret = await getSecret(screenName);
    const token = await checkValidityToken(secret.id, secret.token)
      .then((isValid) => {
        if (isValid) return secret;
        throw new Error();
      })
      .catch(() => getIdAndToken({ email: secret.email, password: secret.password }))
      .then(async ({ id, token }) => {
        await updateSecret(screenName, { id, token });
        return token;
      });

    const reservations = await getReservations(token);
    res.json({ reservations });
  } catch (e) {
    if (e instanceof Error && e.message === 'not found') {
      res.status(404).end();
    }

    res.status(500).end();
  }
});

export const api = functions.region(defaultRegion).https.onRequest(app);
