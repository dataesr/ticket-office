export const buildURL = (
  location: any,
  sort: string,
  status: string,
  query: string,
  page: number,
  searchInMessages: boolean = false,
<<<<<<< HEAD
<<<<<<< HEAD
  fromApplication?: string
=======
  fromApp?: string
>>>>>>> 57156e2 (fix(navigation): contact navigation updated)
=======
  fromApplication?: string
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
): string => {
  const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  const ticketOfficeApiBaseUrl = import.meta.env.BASE_API_URL;
  const baseApiUrl = isDevelopment
    ? "http://localhost:3000/api"
<<<<<<< HEAD
<<<<<<< HEAD:client/src/api/utils/buildURL.tsx
    : `https://ticket-office.staging.dataesr.ovh/api`;
=======
    : `${ticketOfficeApi}/api`;
>>>>>>> 3b9b2fe (feat(remove-user and updatedata): add remove-user and updatedata pages):src/api/utils/buildURL.tsx

  let baseUrl = "contacts";
  if (location?.pathname?.includes("scanr-contributionPage")) {
=======
    : `${ticketOfficeApiBaseUrl}/api`;
=======
  const baseApiUrl = isDevelopment ? "http://localhost:3000/api" : "";
>>>>>>> d40c4ef (typo)
=======
  const baseApiUrl = isDevelopment ? "http://localhost:3000/api" : "/api";
>>>>>>> ac25ef2 (typo)
=======
  const baseApiUrl = isDevelopment
    ? "http://localhost:3000/api"
    : `https://ticket-office.staging.dataesr.ovh/api`;
>>>>>>> d4acea1 (typo)

  let baseUrl = "contacts";
  if (location?.pathname?.includes("scanr-contributionpage")) {
>>>>>>> dfca0bc (chore(api): clean code)
    baseUrl = "contribute";
  } else if (location?.pathname?.includes("removeuser")) {
    baseUrl = "remove-user";
  } else if (location?.pathname?.includes("namechange")) {
    baseUrl = "update-user-data";
  } else if (location?.pathname?.includes("apioperations")) {
    baseUrl = "production";
  }

  const sorted = sort === "ASC" ? "sort=created_at" : "sort=-created_at";

  const where: any = {};
  if (query.trim() !== "") {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(query);

    if (isObjectId) {
      where.id = query;
    } else {
      where.$or = [
        { name: { $regex: `.*${query}.*`, $options: "i" } },
        { id: { $regex: `.*${query}.*`, $options: "i" } },
      ];

      if (searchInMessages) {
        where.$or.push({
          message: { $regex: `.*${query}.*`, $options: "i" },
        });
      }
    }
  }
<<<<<<< HEAD
<<<<<<< HEAD
  const fromAppQuery = fromApplication
    ? `&fromApplication=${fromApplication.toLocaleLowerCase()}`
    : "";
=======
  const fromAppQuery = fromApp ? `&fromApp=${fromApp.toLocaleLowerCase()}` : "";
>>>>>>> 2e9190f (fix(api): update schemas)
=======
  const fromAppQuery = fromApplication
    ? `&fromApplication=${fromApplication.toLocaleLowerCase()}`
    : "";
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
  if (["new", "ongoing", "treated"].includes(status)) {
    where.status = status;
  }

  const whereQuery =
    Object.keys(where).length > 0 ? `&where=${JSON.stringify(where)}` : "";

<<<<<<< HEAD
<<<<<<< HEAD
=======
  const fromAppQuery = fromApp ? `&fromApp=${fromApp.toLocaleLowerCase()}` : "";

>>>>>>> 57156e2 (fix(navigation): contact navigation updated)
=======
>>>>>>> 2e9190f (fix(api): update schemas)
  return `${baseApiUrl}/${baseUrl}?${sorted}&page=${page}&max_results=20${whereQuery}${fromAppQuery}`;
};
