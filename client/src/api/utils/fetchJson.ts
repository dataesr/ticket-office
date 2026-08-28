import { postHeaders } from "../../config/api";

export async function fetchJson<T = any>(
  url: string,
  init: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { ...postHeaders, ...init.headers },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json() as Promise<T>;
}
