export const buildURL = (
  location: any,
  sort: string,
  status: string,
  query: string,
  page: number,
  searchInMessages: boolean = false
): string => {
  const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
  const baseApiUrl = isDevelopment ? "http://localhost:3000" : "/api";

  let baseUrl = "contact";
  if (location?.pathname?.includes("contributionpage")) {
    baseUrl = "contribution";
  } else if (location?.pathname?.includes("apioperations")) {
    baseUrl = "production";
  }

  // Construire les paramètres de tri
  const sorted = sort === "ASC" ? "sort=created_at" : "sort=-created_at";

  // Initialiser l'objet des filtres
  const where: any = {};

  // Ajouter le filtre de recherche par texte
  if (query.trim() !== "") {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(query);

    if (isObjectId) {
      where._id = query;
    } else {
      where.$or = [
        { name: { $regex: `.*${query}.*`, $options: "i" } },
        { _id: { $regex: `.*${query}.*`, $options: "i" } },
      ];

      if (searchInMessages) {
        where.$or.push({ message: { $regex: `.*${query}.*`, $options: "i" } });
      }
    }
  }

  if (["new", "ongoing", "treated"].includes(status)) {
    where.status = status;
  }

  const whereQuery =
    Object.keys(where).length > 0
      ? `&where=${encodeURIComponent(JSON.stringify(where))}`
      : "";

  return `${baseApiUrl}/${baseUrl}?${sorted}&page=${page}&max_results=20${whereQuery}`;
};
