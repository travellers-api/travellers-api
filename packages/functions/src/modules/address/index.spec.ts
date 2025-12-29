import { describe, expect, test } from "vitest";
import { generateNumbers } from ".";
import { dayjs } from "../../lib/dayjs";

describe("generateNumbers", () => {
  describe("通常", () => {
    test("0:00 480件 60分間隔", () => {
      const now = dayjs("2023-06-15T00:00:00+09:00").tz("Asia/Tokyo");
      expect(generateNumbers(now, 480, 60)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    test("0:00 480件 240分間隔", () => {
      const now = dayjs("2023-06-15T00:00:00+09:00").tz("Asia/Tokyo");
      expect(generateNumbers(now, 480, 240)).toEqual([1, 2]);
    });

    test("12:34 480件 60分間隔", () => {
      const now = dayjs("2023-06-15T12:34:56+09:00").tz("Asia/Tokyo");
      expect(generateNumbers(now, 480, 60)).toEqual([
        273, 274, 275, 276, 277, 278, 279, 280,
      ]);
    });

    test("12:34 480件 120分間隔", () => {
      const now = dayjs("2023-06-15T12:34:56+09:00").tz("Asia/Tokyo");
      expect(generateNumbers(now, 480, 120)).toEqual([137, 138, 139, 140]);
    });

    test("12:34 480件 240分間隔", () => {
      const now = dayjs("2023-06-15T12:34:56+09:00").tz("Asia/Tokyo");
      expect(generateNumbers(now, 480, 240)).toEqual([69, 70]);
    });
  });

  describe("割り切れない場合", () => {
    test("12:33 480件 180分間隔", () => {
      const now = dayjs("2023-06-15T12:33:00+09:00").tz("Asia/Tokyo");
      expect(generateNumbers(now, 480, 180)).toEqual([100, 101, 102]);
    });

    test("12:34 480件 180分間隔", () => {
      const now = dayjs("2023-06-15T12:34:56+09:00").tz("Asia/Tokyo");
      expect(generateNumbers(now, 480, 180)).toEqual([103, 104, 105]);
    });

    test("14:39 480件 180分間隔", () => {
      const now = dayjs("2023-06-15T14:39:00+09:00").tz("Asia/Tokyo");
      expect(generateNumbers(now, 480, 180)).toEqual([478, 479, 480]);
    });

    test("14:59 480件 180分間隔", () => {
      const now = dayjs("2023-06-15T14:59:00+09:00").tz("Asia/Tokyo");
      expect(generateNumbers(now, 480, 180)).toEqual([]);
    });
  });

  describe("件数が間隔の数値より少ない場合", () => {
    test("0:00 15件 30分間隔", () => {
      const now = dayjs("2023-06-15T00:00:00+09:00").tz("Asia/Tokyo");
      expect(generateNumbers(now, 15, 30)).toEqual([1]);
    });

    test("0:01 15件 30分間隔", () => {
      const now = dayjs("2023-06-15T00:01:00+09:00").tz("Asia/Tokyo");
      expect(generateNumbers(now, 15, 30)).toEqual([2]);
    });

    test("0:02 15件 30分間隔", () => {
      const now = dayjs("2023-06-15T00:02:00+09:00").tz("Asia/Tokyo");
      expect(generateNumbers(now, 15, 30)).toEqual([3]);
    });

    test("0:15 15件 30分間隔", () => {
      const now = dayjs("2023-06-15T00:15:00+09:00").tz("Asia/Tokyo");
      expect(generateNumbers(now, 15, 30)).toEqual([]);
    });
  });
});
