const ROUTES = [
  { page: "contributionPage", api: "contribute", collection: "contribute" },
  { page: "removeuser", api: "remove-user", collection: "remove-user" },
  {
    page: "namechange",
    api: "update-user-data",
    collection: "update-user-data",
  },
  {
    page: "apioperations",
    api: "production",
    collection: "contribute_productions",
  },
  {
    page: "bso-local-variations-publications",
    api: "bso-local-variations/publications",
    collection: "bso_local_variations_publications",
  },
  {
    page: "bso-local-variations-datasets",
    api: "bso-local-variations/datasets",
    collection: "bso_local_variations_datasets",
  },
];
const CONTACTS = { api: "contacts", collection: "contacts" };

const findRoute = (pathname: string) =>
  ROUTES.find(({ page }) => pathname.includes(page)) ?? CONTACTS;

export const API_ROUTES = [CONTACTS, ...ROUTES].map(({ api }) => api);
export const getApiRoute = (pathname: string) => findRoute(pathname).api;
export const getCollectionName = (pathname: string) =>
  findRoute(pathname).collection;
