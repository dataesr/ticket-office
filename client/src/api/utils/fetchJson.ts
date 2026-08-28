import { postHeaders } from "../../config/api";

export async function fetchJson<T = any>(
  url: string,
  init: RequestInit = {},
  errorMessage = "Network response was not ok"
): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { ...postHeaders, ...init.headers },
  });
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  return response.json() as Promise<T>;
}
