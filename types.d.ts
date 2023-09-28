// This allows TypeScript to assume these libraries are globally available
// for the whole project.
// https://bun.sh/docs/typescript#dom-types
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// This allows TypeScript to understand what Vite will do when non-code
// assets are imported.
declare module "*.ttf" {
  const content: string;
  export default content;
}
declare module "*.jpg" {
  const content: string;
  export default content;
}
declare module "*.webp" {
  const content: string;
  export default content;
}
declare module "*.svg" {
  const content: string;
  export default content;
}
declare module "*.png" {
  const content: string;
  export default content;
}
declare module "*.ocr" {
  const content: string;
  export default content;
}
declare module "*.css?inline" {
  const content: string;
  export default content;
}
