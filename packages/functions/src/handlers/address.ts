import * as express from 'express';
import { getCookie } from '../modules/address/authentication';
import { getReservations } from '../modules/address/reservation';
import { Reservation } from '../modules/address/reservation/types';
import { getAddressSecret, setAddressSecret } from '../modules/firestore';

export const addressApp = express();

addressApp.get<
  undefined,
  {
    reservations: Reservation[];
  },
  undefined,
  {
    email: string;
    password: string;
  }
>('/address/reservations', async (req, res) => {
  try {
    const cookie = await getCookie({
      email: req.query.email,
      password: req.query.password,
    });
    const reservations = await getReservations(cookie);
    res.json({ reservations });
  } catch (e) {
    res.status(500).end();
  }
});

addressApp.get<
  {
    screenName: string;
  },
  {
    reservations: Reservation[];
  }
>('/address/users/:screenName/reservations', async (req, res) => {
  try {
    const { screenName } = req.params;
    const secret = await getAddressSecret(screenName);

    const cookie =
      secret.cookie ||
      (await getCookie(secret).then(async (cookie) => {
        await setAddressSecret(screenName, { cookie });
        return cookie;
      }));
    const reservations = await getReservations(cookie);
    res.json({ reservations });
  } catch (e) {
    if (e instanceof Error && e.message === 'not found') {
      res.status(404).end();
    }

    res.status(500).end();
  }
});
