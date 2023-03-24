import { Hook } from '../../hook/types';

export type Webhook = {
  topics: Hook['topic'][];
  url: string;
};
