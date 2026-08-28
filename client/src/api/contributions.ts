import { useQuery } from "@tanstack/react-query";
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

export const ContributionAllData = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["allContributions"],
    queryFn: () =>
      Promise.all(
        routes.map((route) =>
          fetchJson(`/api/${route}`, {}, `Failed to fetch from ${route}`)
        )
      ),
  });

  return { data, isLoading, isError, refetch };
};
