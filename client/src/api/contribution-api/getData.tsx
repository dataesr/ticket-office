import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "../utils/fetchJson";

const ContributionData = (url: string) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [url],
    queryFn: () => fetchJson(url),
  });

  return { data, isLoading, isError, refetch };
};

export default ContributionData;
