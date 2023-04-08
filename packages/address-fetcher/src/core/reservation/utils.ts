import { Reservation } from './types';

/**
 * 予約を日付順に並び替え
 */
export const sortByCheckInDate = <T extends { checkInDate: string }>(a: T, z: T): number =>
  Number(a.checkInDate.replace(/-/g, '')) - Number(z.checkInDate.replace(/-/g, ''));

/**
 * 連続する予約を連結
 */
export const mergeReservations = (reservations: Reservation[]): Reservation[] => {
  const items: Reservation[] = [];

  reservations.forEach((current) => {
    const prev = items[items.length - 1];

    // 比較対象がない場合はスキップ
    if (!prev) {
      items.push(current);
      return;
    }

    // 拠点が異なる場合はスキップ
    if (prev.home.id !== current.home.id) {
      items.push(current);
      return;
    }

    // 連続した滞在でなければスキップ
    if (prev.checkOutDate !== current.checkInDate) {
      items.push(current);
      return;
    }

    // チェックアウト日
    prev.checkOutDate = current.checkOutDate;
  });

  return items;
};
