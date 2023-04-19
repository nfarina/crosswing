// This allows TypeScript to understand what Vite will do when non-code
// assets are imported.
declare module "*.ttf" {
  const content: string;
  export default content;
}
