import { expect, test } from "vitest";
import { capitalize } from "../strings.js";

test('capitalizes "hello" to "Hello"', () => {
  expect(capitalize("hello")).toBe("Hello");
});

test('capitalizes "hello world" to "Hello world"', () => {
  expect(capitalize("hello world")).toBe("Hello world");
});

test('capitalizes all words in "hello world" to "Hello World" with { allWords: true } option', () => {
  expect(capitalize("hello world", { allWords: true })).toBe("Hello World");
});
