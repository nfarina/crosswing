import { createGlobalStyle } from "@cyber/css";

/** Top-level styles for a mobile website rendered with Cyber. */
export const CyberWebStyle = createGlobalStyle`
  html {
    height: 100%;

    /* Make the site nice on mobile. */
    -webkit-overflow-scrolling: touch;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-font-smoothing: antialiased;
  }

  body {
    height: 100%;
    margin: 0;
    display: flex;
    flex-flow: column;
  }

  /* Whatever main <div> you're rendering your React app into. */
  body > #root {
    flex-grow: 1;
    display: flex;
    flex-flow: column;

    /* Whatever *its* child is. */
    > * {
      flex-grow: 1;
    }
  }
`;
