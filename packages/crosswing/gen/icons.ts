import { transform } from "@svgr/core";
import jsx from "@svgr/plugin-jsx";
import svgo from "@svgr/plugin-svgo";
import fs from "fs/promises";
import { glob } from "glob";
import path from "path";
import prettier from "prettier";

// Auto-generates TypeScript code for each icon.

const srcDir = new URL("../icons", import.meta.url);

// Input: Get all SVG files in the icons directory.
const iconFiles = (await glob(srcDir.pathname + "/*.svg")).map((file) =>
  file.substring(srcDir.pathname.length),
);

for (const iconFile of iconFiles) {
  const match = iconFile.match(/^\/([a-zA-Z0-9_-]+)\.svg$/);

  if (!match) throw new Error(`File did not match pattern: ${iconFile}`);

  const [, name] = match;
  const componentName = `${name}Icon`;
  const svgFilePath = path.join(srcDir.pathname, `${name}.svg`);
  const svgCode = await fs.readFile(svgFilePath, "utf8");

  // Use @svgr/core to transform SVG to React component code.
  const tsxCode = await transform(
    svgCode,
    {
      plugins: [svgo, jsx],
      typescript: true,
      exportType: "named",
      namedExport: componentName,
      // Our icons use the color #1A4A44, which we want to replace with the
      // currentColor CSS variable so that the icon color is what you'd expect.
      replaceAttrValues: { "#1A4A44": "currentColor" },
      jsxRuntime: "automatic",
      // Optimize SVGs with SVGO.
      svgo: true,
      svgoConfig: {
        // Remove the extraneous style attribute added by Figma.
        plugins: [{ name: "removeAttrs", params: { attrs: "(style)" } }],
      },
    },
    { componentName },
  );

  // Transform the code with Prettier.
  const tsxFileContent = await prettier.format(tsxCode, {
    parser: "typescript",
    plugins: [require("prettier/parser-typescript")],
  });

  const tsxFilePath = new URL(`../icons/${name}.tsx`, import.meta.url);
  await fs.writeFile(tsxFilePath, tsxFileContent);
}

console.log(`Generated TypeScript files for icons.`);
