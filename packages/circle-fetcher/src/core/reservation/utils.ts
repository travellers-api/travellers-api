import { convertToJst } from '../../utils/dayjs';

/**
 * 予約を日付順に並び替え
 */
export const sortByCheckInDate = <T extends { checkInDate: string }>(a: T, z: T): number =>
  Number(a.checkInDate.replace(/-/g, '')) - Number(z.checkInDate.replace(/-/g, ''));

/**
 * 今日以降の予約を抽出
 */
export const filterByAfterNow =
  (now: Date) =>
  <T extends { checkInDate: string; checkOutDate: string }>(reservation: T): boolean => {
    if (`${reservation.checkOutDate} 12:00:00` < convertToJst(now)) {
      return false;
    }
    return true;
  };
