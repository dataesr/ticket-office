import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "../utils/fetchJson";
import { AuthorData } from "../../types";

export const useAllAuthorsData = (productionIds: string[]) => {
  const uniqueIds = [...new Set(productionIds.filter(Boolean))];

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-authors", uniqueIds.join(",")],
    queryFn: async () => {
      if (uniqueIds.length === 0) return {};

      const result = await fetchJson(
        "https://scanr.enseignementsup-recherche.gouv.fr/api/scanr-publications/_search",
        {
          method: "POST",
          body: JSON.stringify({
            size: uniqueIds.length,
            _source: ["authors", "id"],
            query: {
              terms: { "id.keyword": uniqueIds },
            },
          }),
        },
        "Erreur réseau"
      );

      const authorsMap: Record<string, AuthorData> = {};

      result.hits?.hits?.forEach((hit) => {
        const id = hit._source?.id || hit._id;
        if (id && hit._source?.authors) {
          authorsMap[id] = {
            fullName:
              hit._source.authors.map((author) => author?.fullName) || [],
            firstName:
              hit._source.authors.map((author) => author?.firstName) || [],
            lastName:
              hit._source.authors.map((author) => author?.lastName) || [],
          };
        }
      });

      return authorsMap;
    },
    enabled: uniqueIds.length > 0,
  });

  return {
    authorsData: data || {},
    isLoading,
    isError,
  };
};
