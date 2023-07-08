import { expect, test } from "vitest";
import { colors } from "../index.js";

test("transforms colors in oklch space", () => {
  const rendered = colors.mediumBlue({
    alpha: 0.5,
    darken: 0.2,
    lighten: 0.2,
    saturation: 0.2,
    hue: 0.2,
  });

  expect(rendered).toMatchInlineSnapshot('"rgba(102, 176, 212, 0.5)"');

  const rendered2 = colors.mediumBlue({
    darken: 0.5,
    saturation: 2,
    hue: 0,
  });

  expect(rendered2).toMatchInlineSnapshot('"rgba(0, 72, 99, 1)"');
});
