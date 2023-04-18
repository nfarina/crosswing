import * as styledImports from "styled-components";

/**
 * A "fast" version of @types/styled-components that does not impact the
 * performance of the TypeScript language service (which is directly related to
 * the performance of VSCode).
 *
 * NOTE: This implements only a fraction of the features provided by the
 * @types/styled-component package. Notably, it does not support typing the
 * "props" parameter when interpolating within template strings. If someone
 * knows how to type that without impacting performance, please let me know!
 *
 * It also does not support "theming" because that would make static CSS
 * exporting impossible (theme is only known at runtime based on React
 * heirarchy).
 */
export interface StyledInterface extends StyledComponentFactories {
  <C extends React.ComponentType<any>>(component: C): StyledFunction<C>;
}

export type StyledComponentFactories = {
  [TTag in keyof JSX.IntrinsicElements]: StyledFunction<TTag>;
};

export interface StyledFunction<
  C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
> {
  <O extends object = {}>(
    first: TemplateStringsArray,
    ...rest: Array<
      // The prop interpolation function option is intentionally commented
      // out. Normally styled-components would allow you to pass a function
      // that receives the props and returns a string, but that makes it
      // impossible to extract the CSS statically in the future, and is also
      // deceptively non-ergonomic. There are many alternative to prop
      // functions that are more performant and should be used instead.
      string | number | StyledComponent<any> // | (() => StyledComponent<any>)
    >
  ): StyledComponent<C, O>;

  attrs<U extends Partial<React.ComponentProps<C>>>(
    props: U | ((props: any) => U),
    // This could possibly be improved to return a component where the props are
    // a union of the original props and the new ones.
  ): StyledFunction<C>;
}

export interface StyledComponent<
  C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  O extends object = {},
> {
  (
    props: React.ComponentProps<C> & {
      as?: string | React.ComponentType<any>;
    } & O,
  ): React.ReactElement<React.ComponentProps<C> & O>;
}

export type CreateGlobalStyleFunction<O extends object = {}> = (
  first: TemplateStringsArray,
  ...rest: any[]
) => StyledComponent<"div", O>;

export type CSSFunction = (
  first: TemplateStringsArray,
  ...rest: any[]
) => string;

export type KeyframesFunction = (
  first: TemplateStringsArray,
  ...rest: any[]
) => string;

export type ServerStyleSheetClass = new () => {
  collectStyles(element: React.ReactElement<any>): React.ReactElement<any>;
  getStyleTags(): string;
  seal(): void;
};

// Re-export (and cast) the subset of styled-components exports that we support.

// In a Node environment, the CJS version of styled-components is used. In a
// browser environment, the "Browser ESM" version is used. Both result in
// different default imports.
export const styled: StyledInterface =
  styledImports.default.default ?? styledImports.default;

export const css: CSSFunction = styledImports.css;

export const keyframes: KeyframesFunction = styledImports.keyframes;

export const createGlobalStyle: CreateGlobalStyleFunction =
  styledImports.createGlobalStyle;

export const ServerStyleSheet: ServerStyleSheetClass =
  styledImports.ServerStyleSheet;
