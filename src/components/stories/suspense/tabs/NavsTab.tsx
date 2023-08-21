import React, { lazy } from "react";
import { NavRoute, Navs } from "../../../../router/navs/Navs";

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
