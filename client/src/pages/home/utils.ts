import { UnifiedContribution } from "../../types";

const DAY_MS = 24 * 60 * 60 * 1000;

const byDateDesc = (a: UnifiedContribution, b: UnifiedContribution) =>
  new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

const matches = (item: UnifiedContribution, query: string) => {
  const q = query.toLowerCase();
  return [item.name, item.email, item.message, item.id].some((field) =>
    field?.toLowerCase().includes(q)
  );
};

export const filterContributions = (
  items: UnifiedContribution[],
  query: string
): UnifiedContribution[] => {
  if (query.trim()) {
    return items.filter((item) => matches(item, query)).sort(byDateDesc);
  }
  const since = Date.now() - DAY_MS;
  return items
    .filter((item) => new Date(item.created_at).getTime() >= since)
    .sort(byDateDesc);
};
