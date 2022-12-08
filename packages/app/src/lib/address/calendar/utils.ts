import { Home } from './types';

export const excludeClosedRooms = (rooms: Home['rooms']): Home['rooms'] => {
  return rooms.filter((room) => {
    return !room.name.match(
      /[(（【](予約停止中|提供終了|2022年10月で提供終了|予約不可|2022年2月で提供終了|提供終了|〜2022\/1\/31 {2}契約終了|2022\/5で契約終了)[)）】]/
    );
  });
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
    .replace(/約(\d)/g, '$1')
    .replace('(2段ベッドツインルーム)', '')
    .replace('ツインルーム116号室', '116号室')
    .replace(/：[男女]性用/, ' ')
    .replace(/[男女]性専用/, '')
    .replace(/号室$/, '')
    .replace('ドミトリー', 'ﾄﾞﾐ')
    .replace('ドミトリ', 'ﾄﾞﾐ')
    .replace('ツイン', 'ﾂｲﾝ')
    .replace('ダブル', 'ﾀﾞﾌﾞﾙ')
    .replace('ロフト', 'ﾛﾌﾄ')
    .replace('テント', 'ﾃﾝﾄ')
    .replace('サイト', 'ｻｲﾄ')
    .replace('カプセル', 'ｶﾌﾟｾﾙ')
    .replace('ルーム', 'ﾙｰﾑ');
};

export const simplifyRoomType = (roomType: string): string => {
  return roomType.replace('ドミトリー', 'ドミ');
};

export const shortenRoomType = (roomType: string): string => {
  return roomType.replace(/^(ドミトリー|ドミ)$/, 'ド').replace(/^個室$/, '個');
};

export const shortenPrefectureName = (prefectureName: string): string => {
  return prefectureName.replace(/[都府県]$/, '');
};

export const shortenHomeType = (homeType: string): string => {
  return (
    {
      戸建て: '戸建',
      シェアハウス: 'ｼｪｱﾊｳｽ',
      ゲストハウス: 'ｹﾞｽﾄﾊｳｽ',
      'ホテル/旅館': 'ﾎﾃ/旅',
      キャンプサイト: 'ｷｬﾝﾌﾟｻｲﾄ',
      その他: '他',
    }[homeType] || homeType
  );
};
