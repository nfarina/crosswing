import { NavRoute, Navs } from "@cyber/router/navs/Navs.js";
import React, { lazy } from "react";

const HomePage = lazy(() => import("../pages/HomePage.js"));

// Simulate a slow import.
const ItemPage = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(import("../pages/ItemPage.js") as any);
    }, 1000);
  });
});

export default function NavsTab() {
  return (
    <Navs>
      <NavRoute render={() => <HomePage />} />
      <NavRoute
        path="/items/:itemId"
        render={({ itemId }) => <ItemPage itemId={itemId} />}
      />
    </Navs>
  );
}
