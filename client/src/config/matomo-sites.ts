export const MATOMO_SITES = {
  "scanr-prod": {
    id: "36",
    name: "Scanr Prod",
  },
  "paysage-prod": {
    id: "46",
    name: "Paysage Prod",
  },
  "curie-prod": {
    id: "41",
    name: "Curie Prod",
  },
  "works-magnet": {
    id: "50",
    name: "Works Magnet Prod",
  },
  BSO: {
    id: "34",
    name: "BSO Prod",
  },
} as const;

export type MatomoSiteKey = keyof typeof MATOMO_SITES;

export const getMatomoSiteId = (siteKey: string): string | null => {
  if (siteKey in MATOMO_SITES) {
    return MATOMO_SITES[siteKey as MatomoSiteKey].id;
  }
  return null;
};

export const getMatomoSites = () => {
  return Object.entries(MATOMO_SITES).map(([key, value]) => ({
    key,
    ...value,
  }));
};
