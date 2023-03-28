import * as cheerio from 'cheerio';

export const parseToken = (
  html: string
): {
  authenticityToken: string;
} => {
  const $ = cheerio.load(html);
  const authenticityToken = $('input[name="authenticity_token"]').attr('value');

  if (!authenticityToken) {
    throw new Error('AuthenticityToken is not set.');
  }

  return {
    authenticityToken,
  };
};
