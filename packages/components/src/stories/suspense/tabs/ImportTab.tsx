import React, { lazy } from "react";
import { NoContent } from "../../../NoContent.js";

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
