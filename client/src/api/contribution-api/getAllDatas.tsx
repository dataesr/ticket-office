import { useQuery } from "@tanstack/react-query";
import { postHeaders } from "../../config/api";

const routes = [
  "contacts",
  "contribute",
  "production",
  "remove-user",
  "update-user-data",
];

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

const ContributionAllDatas = (baseApiUrl) => {
  const fetchContributions = () => fetchAllData(baseApiUrl);
  const { data, isLoading, isError, refetch } = useQuery(
    ["allContributions"],
    fetchContributions
  );
  return { data, isLoading, isError, refetch };
};

export default ContributionAllDatas;
