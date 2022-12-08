import { Home } from './types';

export const excludeClosedRooms = (rooms: Home['rooms']): Home['rooms'] => {
  return rooms.filter(
    (room) =>
      !room.name.match(
        /[(（【](予約停止中|提供終了|2022年10月で提供終了|予約不可|2022年2月で提供終了|提供終了|〜2022\/1\/31 {2}契約終了)[)）】]/
      )
  );
};

export const simplifyRoomName = (roomName: string): string => {
  return roomName
    .replace(/\s+/g, ' ')
    .replace(/[(（]/, '(')
    .replace(/[）)]/, ')')
    .replace('(2022/2/1~)', '')
    .replace('一階ゲストルーム', '')
    .replace('(リンガー)', '')
    .replace('(グラバー)', '')
    .replace(/(シングルルーム|ツインルーム) (\d号室)/, '$2')
    .replace('男女共用', '')
    .replace(/シングルルーム(.+)/, '$1')
    .replace(/(区画(オート)?)(サイト.+)[(（](.+)[)）]/, '$3 ($4)')
    .replace(/約/g, '')
    .replace('(2段ベッドツインルーム)', '')
    .replace('ツインルーム116号室', '116号室')
    .replace(/：[男女]性用/, ' ');
};

export const simplifyRoomType = (roomType: string): string => {
  return roomType.replace('ドミトリー', 'ドミ');
};
