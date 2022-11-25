import * as express from 'express';
import { getCookie } from '../modules/address/authentication';
import { getReservations } from '../modules/address/reservation';
import { Reservation } from '../modules/address/reservation/types';

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
