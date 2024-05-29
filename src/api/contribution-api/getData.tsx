import { useQuery } from "@tanstack/react-query";
import { postHeaders } from "../../config/api";
import { buildURL } from "../utils/buildURL";

const ContributionData = ({
  location,
  sort,
  status,
  query,
  page,
  searchInMessage,
}) => {
  const fetchContributions = async () => {
    const url = buildURL(location, sort, status, query, page, searchInMessage);
    const response = await fetch(url, {
      headers: postHeaders,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, isLoading, isError, refetch } = useQuery(
    [location, sort, status, query, page, searchInMessage],
    fetchContributions
  );

  return { data, isLoading, isError, refetch };
};

export default ContributionData;
