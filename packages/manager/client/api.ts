const apiHost = (() => {
  if (import.meta.env.DEV) {
    const host = "//0.0.0.0:2700";
    console.warn(
      `Running in Vite dev server; hardcoding Crosswing manager API to ${host}`,
    );
    return host;
  }

  return "";
})();

export async function api(path: string, init?: FetchRequestInit): Promise<any> {
  const response = await fetch(`${apiHost}/api/${path}`, init);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
}
