import { NoContent } from "@cyber/components/NoContent";
import { wait } from "@cyber/shared/wait";
import React from "react";

export default function DataTab() {
  const result = use(fetchData());

  return (
    <NoContent title="Suspense Data" subtitle={<>Data fetched: {result}</>} />
  );
}

let cached: Promise<number> | undefined;

function fetchData() {
  if (!cached) {
    cached = getData();
    throw cached;
  }

  return cached;
}

async function getData() {
  await wait(1000);
  return 42;
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === "fulfilled") {
    return promise.value;
  } else if (promise.status === "rejected") {
    throw promise.reason;
  } else if (promise.status === "pending") {
    throw promise;
  } else {
    promise.status = "pending";
    promise.then(
      (result) => {
        promise.status = "fulfilled";
        promise.value = result;
      },
      (reason) => {
        promise.status = "rejected";
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
