export const buildURL = (
  location: any,
  sort: string,
  status: string,
  query: string,
  page: number,
  searchInMessages: boolean = false
): string => {
  const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
  const baseApiUrl = isDevelopment ? "https://scanr-api.dataesr.ovh" : "/api";

  let baseUrl = "contact";

  if (location?.pathname?.includes("contributionpage")) {
    baseUrl = "contribute";
  } else if (location?.pathname?.includes("apioperations")) {
    baseUrl = "contribute_productions";
  }
  const sorted = sort === "ASC" ? "sort=created_at" : "sort=-created_at";
  const where: any = {};
  if (query.trim() !== "") {
    where.$or = [{ name: { $regex: `.*${query}.*`, $options: "i" } }];
    if (searchInMessages) {
      where.$or.push({ message: { $regex: `.*${query}.*`, $options: "i" } });
    }
  }

  if (["new", "ongoing", "treated"].includes(status)) {
    where.status = status;
  }

  const whereQuery =
    Object.keys(where).length > 0 ? `&where=${JSON.stringify(where)}` : "";

  return `${baseApiUrl}/${baseUrl}?${sorted}&page=${page}&max_results=20${whereQuery}`;
};
