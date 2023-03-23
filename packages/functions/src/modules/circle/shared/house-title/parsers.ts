import { Home } from './types';

export const parseHomeTitle = (input: string): Home => {
  const regex = /^【(.+?)\s*\/\s*(.+?)】(.+)$/;
  const match = regex.exec(input);
  if (!match) {
    throw new Error('Invalid input string');
  }
  const [, city = '', roomType = '', name = ''] = match;
  return { name, city, roomType };
};
