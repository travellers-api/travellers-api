import {
  checkValidityCookie,
  getCookie,
} from "@travellers-api/address-fetcher/lib/core/authentication";
import { getReservations } from "@travellers-api/address-fetcher/lib/core/reservation";
import { Reservation } from "@travellers-api/address-fetcher/lib/core/reservation/types";
import * as express from "express";
import { onRequest } from "firebase-functions/https";
import { getHomes } from "../../modules/firestore/cachedAddressHomes";
import { getAddressCalendarCache } from "../../modules/firestore/caches";
import { AddressCalendar } from "../../modules/firestore/caches/types";
import {
  getSecret,
  updateSecret,
} from "../../modules/firestore/secret/address";
import { defaultRegion } from "../../modules/functions/constants";

const app = express();

app.get<
  undefined,
  {
    reservations: Reservation[];
  },
  undefined,
  {
    email: string;
    password: string;
  }
>("/address/reservations", async (req, res) => {
  try {
    const cookie = await getCookie({
      email: req.query.email,
      password: req.query.password,
    });
    const reservations = await getReservations(cookie);
    res.json({ reservations });
  } catch {
    res.status(500).end();
  }
});

app.get<
  {
    screenName: string;
  },
  {
    reservations: Reservation[];
  }
>("/address/users/:screenName/reservations", async (req, res) => {
  try {
    const { screenName } = req.params;
    const secret = await getSecret(screenName);
    const cookie = await checkValidityCookie(secret.cookie)
      .then((isValid) => {
        if (isValid) return secret.cookie;
        throw new Error();
      })
      .catch(() => getCookie(secret))
      .then(async (cookie) => {
        await updateSecret(screenName, { cookie });
        return cookie;
      });

    const reservations = await getReservations(cookie);
    res.json({ reservations });
  } catch (e) {
    if (e instanceof Error && e.message === "not found") {
      res.status(404).end();
    }

    res.status(500).end();
  }
});

app.get<undefined, AddressCalendar>("/address/calendar", async (_req, res) => {
  try {
    const json = await getAddressCalendarCache().catch(async () => {
      const homes = await getHomes();
      const json = {
        homes: homes.map(({ data: { address: _address, ...data } }) => data),
      };
      return json;
    });
    res.setHeader("Cache-Control", "public, max-age=60, must-revalidate");
    res.json(json);
  } catch {
    res.status(500).end();
  }
});

export const apiV2 = onRequest({ region: defaultRegion }, app);
