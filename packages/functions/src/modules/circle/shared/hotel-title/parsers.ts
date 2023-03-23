import { Hotel } from './types';

export const parseHotelTitle = (input: string): Hotel => {
  const regex = /^【(.+?)\s*\/\s*(.+?)】(.+)$/;
  const match = regex.exec(input);
  if (!match) {
    throw new Error('Invalid input string');
  }
  const [, city = '', roomType = '', name = ''] = match;
  return { name, city, roomType };
};
