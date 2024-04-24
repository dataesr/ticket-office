import { useLocation } from "react-router-dom";

export const buildURL = (
  sort: string,
  status: string,
  query: string,
  page: number,
  searchInMessages: boolean = false
): string => {
  const location = useLocation();
  const baseUrl = location.pathname.includes("contributionpage")
    ? "contribute"
    : "contact";
  const sorted = sort === "ASC" ? "sort=created_at" : "sort=-created_at";
  const where: any = {};
  if (query) {
    where.$or = [
      { name: { $regex: `.*${query}.*`, $options: "i" } },
      searchInMessages && {
        message: { $regex: `.*${query}.*`, $options: "i" },
      },
    ];
  }
  if (["new", "ongoing", "treated"].includes(status)) {
    where.status = status;
  }

  return `https://scanr-api.dataesr.ovh/${baseUrl}?${sorted}&page=${page}&max_results=20&where=${JSON.stringify(
    where
  )}`;
};
