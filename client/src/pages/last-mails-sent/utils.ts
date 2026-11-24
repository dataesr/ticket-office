const collectionNameMapping: { [key: string]: string } = {
  contribute: "Contribution par objets",
  contacts: "Formulaire de contact",
  contribute_productions: "Lier des publications",
  "remove-user": "Retirer de la base de données",
  "update-user-data": "Changement de nom",
  bso_local_variations_publications: "Demande de bso local",
  local_variations: "BSO Publications - Déclinaisons locales",
  bso_local_variations_datasets: "BSO Jeux de données - Déclinaisons locales",
};

export default collectionNameMapping;

export interface SentEmail {
  _id: string;
  collectionName: string;
  contributionId: string;
  fromApplication?: string;
  message: string | null;
  name: string | null;
  selectedProfile: string;
  sentAt: string;
  subject: string;
  to: string;
  userResponse: string;
}

export interface SentMailFilters {
  profile: string;
  objectType: string;
  application: string;
  query: string[];
  dateFrom: string;
  dateTo: string;
}

export const getObjectTypeOptions = (
  emails: SentEmail[]
): { value: string; label: string }[] =>
  [...new Set(emails.map((email) => email.collectionName).filter(Boolean))]
    .map((name) => ({
      value: name,
      label: collectionNameMapping[name] || name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

export const getApplications = (emails: SentEmail[]): string[] =>
  [
    ...new Set(emails.map((email) => email.fromApplication).filter(Boolean)),
  ].sort();

export const filterSentEmails = (
  emails: SentEmail[],
  filters: SentMailFilters
): SentEmail[] => {
  const from = filters.dateFrom ? new Date(filters.dateFrom).getTime() : null;
  const to = filters.dateTo
    ? new Date(`${filters.dateTo}T23:59:59`).getTime()
    : null;
  const terms = filters.query
    .map((term) => term.trim().toLowerCase())
    .filter(Boolean);

  return emails.filter((email) => {
    if (
      filters.profile !== "all" &&
      email.selectedProfile !== filters.profile
    ) {
      return false;
    }
    if (
      filters.objectType !== "all" &&
      email.collectionName !== filters.objectType
    ) {
      return false;
    }
    if (
      filters.application !== "all" &&
      email.fromApplication !== filters.application
    ) {
      return false;
    }
    if (from !== null || to !== null) {
      const sentAt = new Date(email.sentAt).getTime();
      if (from !== null && sentAt < from) return false;
      if (to !== null && sentAt > to) return false;
    }
    if (terms.length > 0) {
      const haystack = [
        email.name,
        email.to,
        email.userResponse,
        email.message,
        email.subject,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!terms.some((term) => haystack.includes(term))) return false;
    }
    return true;
  });
};
