import { Contribution } from "../../types";

export const getPageTitle = (pathname: string): string => {
  if (pathname.includes("contributionPage")) return "Contribution par objets";
  if (pathname.includes("removeuser")) return "Demande de suppression";
  if (pathname.includes("namechange")) return "Demande de changement de nom";
  return "Contribution via formulaire de contact";
};

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
