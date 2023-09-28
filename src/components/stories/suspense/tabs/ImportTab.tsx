import { lazy } from "react";
import { NoContent } from "../../../NoContent";
import { usePageTitle } from "../../../sites/SitePageTitle";

const PopupButton = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(import("./PopupButton.js") as any);
    }, 1000);
  });
});

export default function ImportTab() {
  usePageTitle("Import"); // For <SuspenseSite> story.

  return <NoContent title="Suspense Import" subtitle={<PopupButton />} />;
}
