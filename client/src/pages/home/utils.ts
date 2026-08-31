import { UnifiedContribution } from "../../types";
import {
  CONTACT_PATHS,
  withContributionQuery,
} from "../../utils/contribution-links";

const CONTACT_DEFAULT = "/scanr-contact";

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

export function generateLinkFromAllDatas(
  fromApplication: string,
  id?: string,
  objectId?: string,
  productions?: any,
  message?: string,
  contributionType?: string,
  hasCsv?: boolean
): string {
  if (hasCsv) {
    return withContributionQuery("/bso-local-variations-publications", id);
  }

  const typePaths: Record<string, string> = {
    "remove-user": "/scanr-removeuser",
    "update-user-data": "/scanr-namechange",
    contribute: "/scanr-contributionPage",
    contribute_production: "/scanr-apioperations",
  };

  let basePath = "";
  if (productions?.length > 0 && message === undefined) {
    basePath = "/scanr-apioperations";
  } else if (objectId) {
    basePath = "/scanr-contributionPage";
  } else if (contributionType) {
    basePath =
      contributionType === "contact" && fromApplication
        ? CONTACT_PATHS[fromApplication] || CONTACT_DEFAULT
        : typePaths[contributionType] || "";
  } else if (fromApplication) {
    basePath = CONTACT_PATHS[fromApplication] || CONTACT_DEFAULT;
  }

  return withContributionQuery(basePath, id);
}
