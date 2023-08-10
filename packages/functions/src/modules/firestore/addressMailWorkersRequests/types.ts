import { ParsedMail } from 'mailparser';

export type AddressMailWorkersRequest = {
  from: string;
  to: string;
  raw: string;
  parsed: Pick<ParsedMail, 'from' | 'to' | 'subject' | 'html' | 'text' | 'textAsHtml'>;
};
