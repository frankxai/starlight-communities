import { describe, expect, it } from "vitest";
import { slugify, titleCase, uniqueSorted } from "../src/util";

describe("util", () => {
  describe("slugify", () => {
    it("should handle standard strings", () => {
      expect(slugify("Hello World")).toBe("hello-world");
    });

    it("should remove special characters and replace with dash", () => {
      expect(slugify("Hello!!! World@#$")).toBe("hello-world");
    });

    it("should trim dashes from ends", () => {
      expect(slugify("---Hello World---")).toBe("hello-world");
    });

    it("should truncate at 80 characters", () => {
      const longString = "a".repeat(100);
      expect(slugify(longString)).toBe("a".repeat(80));
    });

    it("should fallback to 'untitled' when empty", () => {
      expect(slugify("")).toBe("untitled");
      expect(slugify("!!!")).toBe("untitled");
    });
  });

  describe("titleCase", () => {
    it("should handle basic strings", () => {
      expect(titleCase("hello world")).toBe("Hello World");
    });

    it("should handle dashes and underscores", () => {
      expect(titleCase("hello-world_test")).toBe("Hello World Test");
    });

    it("should lowercase the rest of the word", () => {
      expect(titleCase("hElLo WoRlD")).toBe("Hello World");
    });

    it("should handle extra spaces", () => {
      expect(titleCase("  hello   world  ")).toBe("Hello World");
    });
  });

  describe("uniqueSorted", () => {
    it("should remove duplicates and sort", () => {
      expect(uniqueSorted(["c", "a", "b", "a"])).toEqual(["a", "b", "c"]);
    });

    it("should ignore empty or whitespace-only elements", () => {
      expect(uniqueSorted(["c", " ", "", "a"])).toEqual(["a", "c"]);
    });

    it("should trim strings before deduplication", () => {
      expect(uniqueSorted(["a", " a ", "b"])).toEqual(["a", "b"]);
    });

    it("should handle Sets and other iterables", () => {
      expect(uniqueSorted(new Set(["c", "a", "b", "a"]))).toEqual(["a", "b", "c"]);
    });
  });
});
