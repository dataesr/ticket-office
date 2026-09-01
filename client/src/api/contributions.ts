import { keepPreviousData, useQuery } from "@tanstack/react-query";
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

export const ContributionAllData = (maxResults = 200) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["allContributions", maxResults],
    queryFn: () =>
      Promise.all(
        routes.map((route) =>
          fetchJson(
            `/api/${route}?sort=-created_at&max_results=${maxResults}`,
            {},
            `Failed to fetch from ${route}`
          )
        )
      ),
    placeholderData: keepPreviousData,
  });

  return { data, isLoading, isError, refetch };
};
