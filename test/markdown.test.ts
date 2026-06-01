import { describe, expect, test } from "bun:test";
import { isSafeExternalHref, splitMarkdownBlocks } from "../src/markdown";

describe("markdown helpers", () => {
  test("splits whitespace-separated paragraphs", () => {
    expect(splitMarkdownBlocks("One\n\n \nTwo\nThree")).toEqual(["One", "Two\nThree"]);
  });

  test("allows normal outbound links and rejects script URLs", () => {
    expect(isSafeExternalHref("https://example.com")).toBe(true);
    expect(isSafeExternalHref("http://example.com")).toBe(true);
    expect(isSafeExternalHref("mailto:test@example.com")).toBe(true);
    expect(isSafeExternalHref("javascript:alert(1)")).toBe(false);
    expect(isSafeExternalHref("data:text/html,hello")).toBe(false);
  });
});
