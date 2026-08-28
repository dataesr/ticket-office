import { Contribution } from "../../types";

export const filterContributions = (
  contributions: Contribution[],
  query: string[],
  searchInMessage: boolean
): Contribution[] => {
  if (query.length === 0) return contributions;

  const queryLower = query.map((q) => q.toLowerCase());
  const matches = (value?: string) =>
    !!value && queryLower.some((q) => value.toLowerCase().includes(q));

  return contributions.filter(
    (c) =>
      matches(c.name) ||
      matches(c.id) ||
      (searchInMessage && matches(c.message))
  );
};

export const updateUrlParams = (
  search: string,
  updates: Record<string, string>
) => {
  const params = new URLSearchParams(search);
  Object.entries(updates).forEach(([key, value]) => params.set(key, value));
  window.history.pushState(
    {},
    "",
    `${window.location.pathname}?${params.toString()}`
  );
};
