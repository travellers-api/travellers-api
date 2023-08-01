import { ParsedMail } from 'mailparser';

export type AddressMailWorkersRequest = {
  from: string;
  to: string;
  raw: string;
  parsed: ParsedMail;
};
