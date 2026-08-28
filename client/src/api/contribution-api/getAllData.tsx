import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "../utils/fetchJson";

const routes = [
  "contacts",
  "contribute",
  "production",
  "remove-user",
  "update-user-data",
  "bso-local-variations/publications",
  "bso-local-variations/datasets",
];

const fetchAllData = (baseApiUrl: string) =>
  Promise.all(
    routes.map((route) =>
      fetchJson(`${baseApiUrl}/${route}`, {}, `Failed to fetch from ${route}`)
    )
  );

const ContributionAllData = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["allContributions"],
    queryFn: () => fetchAllData("/api"),
  });

  return { data, isLoading, isError, refetch };
};

export default ContributionAllData;
