import { NavRoute, Navs } from "@cyber/router/navs";
import { lazy } from "react";

const PageOne = lazy(() => import("../pages/PageOne.js"));

// Simulate a slow import.
const PageTwo = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(import("../pages/PageTwo.js") as any);
    }, 1000);
  });
});

export default function NavsTab() {
  return (
    <Navs>
      <NavRoute render={() => <PageOne />} />
      <NavRoute path="pages/two" render={() => <PageTwo />} />
    </Navs>
  );
}
