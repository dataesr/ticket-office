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

export const getContributionTitle = (contribution: UnifiedContribution) =>
  contribution.name ||
  contribution.contact?.email ||
  contribution.email ||
  "Contribution";

export const getContributionLabel = (contribution: UnifiedContribution) => {
  const contributionType = contribution.contributionType || "";
  const hasProductions =
    Array.isArray(contribution.productions) &&
    contribution.productions.length > 0;

  if (contributionType === "contribute_production" || hasProductions)
    return "Lier des publications";
  if (contributionType === "contribute" || contribution.objectId)
    return "Contribution par objet";
  if (contributionType === "remove-user") return "Suppression de compte";
  if (contributionType === "update-user-data") return "Mise à jour de données";
  if (contribution.csv) return "Demande de BSO Local";
  return "Contact";
};

const SCANR_CONTRIBUTION_TYPES = [
  "remove-user",
  "contact",
  "update-user-data",
  "contribute-object",
  "production",
];

export const isFromScanR = (contribution: UnifiedContribution) =>
  contribution.fromApplication === "scanr" ||
  SCANR_CONTRIBUTION_TYPES.includes(contribution.contributionType || "");
