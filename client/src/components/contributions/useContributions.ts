import { useMemo } from "react";
import { ContributionData } from "../../api/contributions";
import { buildApiURL } from "../../api/utils/buildURL";
import { Contribution } from "../../types";
import { useContributionFilters } from "./useContributionFilters";
import { filterContributions } from "./utils";

export const PAGE_SIZE = 20;

type Filters = ReturnType<typeof useContributionFilters>;

export const useContributions = (
  apiRoute: string,
  filters: Filters,
  fromApplication?: string
) => {
  const url = buildApiURL(
    apiRoute,
    filters.sort,
    filters.status,
    filters.query.join(" "),
    filters.page,
    filters.searchInMessage,
    fromApplication,
    PAGE_SIZE.toString(),
    undefined,
    filters.objectType
  );

  const { data, isLoading, isError, refetch } = ContributionData(url);
  const { data: allTags } = ContributionData(`/api/tags/${apiRoute}`);

  const contributions: Contribution[] = useMemo(
    () =>
      filterContributions(
        data?.data || [],
        filters.query,
        filters.searchInMessage
      ),
    [data, filters.query, filters.searchInMessage]
  );

  return {
    apiRoute,
    contributions,
    meta: data?.meta,
    allTags,
    isLoading,
    isError,
    refetch,
  };
};
