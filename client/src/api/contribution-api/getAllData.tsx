import { useQuery } from "@tanstack/react-query";
import { postHeaders } from "../../config/api";

const routes = [
  "contacts",
  "contribute",
  "production",
  "remove-user",
  "update-user-data",
  "bso-local-variations/publications",
  "bso-local-variations/datasets",
]

const fetchAllData = async (baseApiUrl) => {
  const fetchPromises = routes.map(async (route) => {
    const url = `${baseApiUrl}/${route}`;
    const response = await fetch(url, {
      headers: postHeaders,
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch from ${route}`);
    }
    return response.json();
  });

  return Promise.all(fetchPromises);
};

const ContributionAllData = () => {
  const fetchContributions = () => fetchAllData("/api");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["allContributions"],
    queryFn: fetchContributions,
  });

  return { data, isLoading, isError, refetch };
};

export default ContributionAllData;
