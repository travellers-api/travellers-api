import { FunctionBuilder } from 'firebase-functions';
import { getCookie } from '../modules/address/authentication';
import { getHome } from '../modules/address/home';
import { getAddressSecret, setAddressSecret } from '../modules/firestore';

export const crawlAddressHomesHandler: Parameters<FunctionBuilder['https']['onRequest']>[0] = async (req, res) => {
  try {
    const secret = await getAddressSecret('amon');
    const cookie =
      secret.cookie ||
      (await getCookie(secret).then(async (cookie) => {
        await setAddressSecret('amon', { cookie });
        return cookie;
      }));

    const home = await getHome(req.query.id as string, cookie);
    res.json({ home });
  } catch (e) {
    if (e instanceof Error && e.message === 'not found') {
      res.status(404).end();
    } else {
      res.status(500).end();
    }
  }
};
