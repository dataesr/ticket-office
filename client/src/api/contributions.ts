import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { escapeRegex } from "./utils/escapeRegex";
import { fetchJson } from "./utils/fetchJson";

export const ContributionData = (url: string) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [url],
    queryFn: () => fetchJson(url),
  });

  return { data, isLoading, isError, refetch };
};

const routes = [
  "contacts",
  "contribute",
  "production",
  "remove-user",
  "update-user-data",
  "bso-local-variations/publications",
  "bso-local-variations/datasets",
];

const DAY_MS = 24 * 60 * 60 * 1000;
const SEARCH_FIELDS = ["name", "email", "message", "id"];

const buildWhere = (search: string) => {
  if (search) {
    const $regex = escapeRegex(search);
    return {
      $or: SEARCH_FIELDS.map((field) => ({
        [field]: { $regex, $options: "i" },
      })),
    };
  }
  const since = new Date(Date.now() - DAY_MS).toISOString();
  return {
    $expr: {
      $gte: ["$created_at", { $dateFromString: { dateString: since } }],
    },
  };
};

export const ContributionAllData = (search = "") => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["allContributions", search],
    queryFn: () => {
      const maxResults = search ? 2000 : 200;
      const where = encodeURIComponent(JSON.stringify(buildWhere(search)));
      return Promise.all(
        routes.map((route) =>
          fetchJson(
            `/api/${route}?sort=-created_at&max_results=${maxResults}&where=${where}`,
            {},
            `Failed to fetch from ${route}`
          )
        )
      );
    },
    placeholderData: keepPreviousData,
  });

  return { data, isLoading, isError, refetch };
};
