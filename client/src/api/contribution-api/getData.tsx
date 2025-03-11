import { useQuery } from "@tanstack/react-query";
import { postHeaders } from "../../config/api";

const ContributionData = (url: string) => {
  const fetchContributions = async () => {
    const response = await fetch(url, {
      headers: postHeaders,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [url],
    queryFn: fetchContributions,
  });

  return { data, isLoading, isError, refetch };
};

export default ContributionData;
