const apiHost = (() => {
  // Is there a "port=xyz" in the URL?
  const port = new URL(window.location.href).searchParams.get("port");

  if (port) {
    return `//0.0.0.0:${port}`;
  }

  return "";
})();

export async function api(path: string, init?: RequestInit): Promise<any> {
  const response = await fetch(`${apiHost}/api/${path}`, init);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
}
