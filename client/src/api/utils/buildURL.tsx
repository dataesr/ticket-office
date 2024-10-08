export const buildURL = (
  location: any,
  sort: string,
  status: string,
  query: string,
  page: number,
  searchInMessages: boolean = false,
  fromApplication?: string
): string => {
  const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
  const url = import.meta.env.VITE_BASE_API_URL;
  const baseApiUrl = isDevelopment ? "http://localhost:3000/api" : `${url}/api`;

  let baseUrl = "contacts";
  if (location?.pathname?.includes("scanr-contributionPage")) {
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
  const fromAppQuery = fromApplication
    ? `&fromApplication=${fromApplication.toLocaleLowerCase()}`
    : "";
  if (["new", "ongoing", "treated"].includes(status)) {
    where.status = status;
  }

  const whereQuery =
    Object.keys(where).length > 0 ? `&where=${JSON.stringify(where)}` : "";

  return `${baseApiUrl}/${baseUrl}?${sorted}&page=${page}&max_results=20${whereQuery}${fromAppQuery}`;
};
