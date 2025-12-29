import { describe, expect, test } from "vitest";
import { addDays, addMonths, getDiffDays } from ".";

describe("date", () => {
  describe("addDays", () => {
    test("日付の足し算", () => {
      expect(addDays("2023-01-01", 3)).toBe("2023-01-04");
    });

    test("日付の引き算", () => {
      expect(addDays("2023-01-01", -3)).toBe("2022-12-29");
    });

    test("日付の足し算 スラッシュ", () => {
      expect(addDays("2023/01/01", 3)).toBe("2023/01/04");
    });
  });

  describe("addMonths", () => {
    test("日付の足し算", () => {
      expect(addMonths("2023-01-01", 3)).toBe("2023-04-01");
    });

    test("日付の引き算", () => {
      expect(addMonths("2023-01-01", -3)).toBe("2022-10-01");
    });

    test("日付の足し算 スラッシュ", () => {
      expect(addMonths("2023/01/01", 3)).toBe("2023/04/01");
    });
  });

  describe("getDiffDays", () => {
    test("日付の比較 大なり", () => {
      expect(getDiffDays("2023-01-01", "2022-12-29")).toBe(3);
    });

    test("日付の比較 小なり", () => {
      expect(getDiffDays("2023-01-01", "2023-01-04")).toBe(-3);
    });

    test("日付の比較 スラッシュが混ざる", () => {
      expect(getDiffDays("2023/01/01", "2022-12-29")).toBe(3);
    });
  });
});
