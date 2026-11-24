import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { COLLECTIONS } from "../config/api-routes";
import { escapeRegex } from "./utils/escapeRegex";
import { fetchJson } from "./utils/fetchJson";

export const ContributionData = (url: string) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [url],
    queryFn: () => fetchJson(url),
  });

  return { data, isLoading, isError, refetch };
};

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
    queryFn: async () => {
      const maxResults = search ? 2000 : 200;
      const where = encodeURIComponent(JSON.stringify(buildWhere(search)));
      const responses = await Promise.all(
        COLLECTIONS.map(({ api }) =>
          fetchJson(
            `/api/${api}?sort=-created_at&max_results=${maxResults}&where=${where}`,
            {},
            `Failed to fetch from ${api}`
          )
        )
      );
      return responses.flatMap(({ data }, index) =>
        (data || []).map((item) => ({
          ...item,
          collectionName: COLLECTIONS[index].collection,
        }))
      );
    },
    placeholderData: keepPreviousData,
  });

  return { data, isLoading, isError, refetch };
};
