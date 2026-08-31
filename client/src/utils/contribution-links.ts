export const CONTACT_PATHS: Record<string, string> = {
  scanr: "/scanr-contact",
  paysage: "/paysage-contact",
  bso: "/bso-contact",
  curiexplore: "/curiexplore-contact",
  "works-magnet": "/works-magnet-contact",
  tableaux: "/tableaux-contact",
};

export const withContributionQuery = (basePath: string, id?: string) =>
  id
    ? `${basePath}?page=1&query=${id}&searchInMessage=false&sort=DESC&status=choose`
    : basePath;
