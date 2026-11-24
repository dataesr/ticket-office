const ROUTES = [
  {
    path: "/scanr-contributionPage",
    api: "contribute",
    collection: "contribute",
  },
  { path: "/scanr-removeuser", api: "remove-user", collection: "remove-user" },
  {
    path: "/scanr-namechange",
    api: "update-user-data",
    collection: "update-user-data",
  },
  {
    path: "/scanr-apioperations",
    api: "production",
    collection: "contribute_productions",
  },
  {
    path: "/bso-local-variations-publications",
    api: "bso-local-variations/publications",
    collection: "bso_local_variations_publications",
  },
  {
    path: "/bso-local-variations-datasets",
    api: "bso-local-variations/datasets",
    collection: "bso_local_variations_datasets",
  },
];

const CONTACTS = { api: "contacts", collection: "contacts" };
const CONTACT_PATHS: Record<string, string> = {
  scanr: "/scanr-contact",
  tableaux: "/tableaux-contact",
};

const findRoute = (pathname: string) =>
  ROUTES.find(({ path }) => pathname.includes(path)) ?? CONTACTS;

export const COLLECTIONS = [CONTACTS, ...ROUTES];
export const getApiRoute = (pathname: string) => findRoute(pathname).api;
export const getCollectionName = (pathname: string) =>
  findRoute(pathname).collection;
export const getPagePath = (collection: string, fromApplication = "") =>
  collection === CONTACTS.collection
    ? (CONTACT_PATHS[fromApplication] ?? "/scanr-contact")
    : (ROUTES.find((route) => route.collection === collection)?.path ?? "");
