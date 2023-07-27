import { NoContent } from "@cyber/components/NoContent";
import React, { lazy } from "react";

const PopupButton = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(import("./PopupButton.js") as any);
    }, 1000);
  });
});

export default function ImportTab() {
  return <NoContent title="Suspense Import" subtitle={<PopupButton />} />;
}
