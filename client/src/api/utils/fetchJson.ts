import { postHeaders } from "../../config/api";

export async function fetchJson(
  url: string,
  init: RequestInit = {},
  errorMessage = "Network response was not ok"
) {
  const response = await fetch(url, {
    ...init,
    headers: { ...postHeaders, ...init.headers },
  });
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  return response.json();
}
