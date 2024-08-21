import { useQuery } from "@tanstack/react-query";

type FetchOptions = {
  id?: string;
};

const ContributionData = (url: string, { id }: FetchOptions = {}) => {
  const fetchContributions = async () => {
    const response = await fetch(url, {});
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Fetch error:", errorText);
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, isLoading, isError, refetch } = useQuery(
    [url, id],
    fetchContributions
  );
  return { data, isLoading, isError, refetch };
};

export default ContributionData;
