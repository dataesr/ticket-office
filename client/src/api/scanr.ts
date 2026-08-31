import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "./utils/fetchJson";
import { AuthorData } from "../types";

const SCANR_PUBLICATIONS =
  "https://scanr.enseignementsup-recherche.gouv.fr/api/scanr-publications/_search";
const SCANR_PERSONS =
  "https://scanr.enseignementsup-recherche.gouv.fr/api/scanr-persons/_search";

export const useAllAuthorsData = (productionIds: string[]) => {
  const uniqueIds = [...new Set(productionIds.filter(Boolean))];

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-authors", uniqueIds.join(",")],
    queryFn: async () => {
      if (uniqueIds.length === 0) return {};

      const result = await fetchJson(
        SCANR_PUBLICATIONS,
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

export const NameFromIdref = (id: string) => {
  const { data, refetch } = useQuery({
    queryKey: [SCANR_PERSONS, id],
    queryFn: () =>
      fetchJson(SCANR_PERSONS, {
        method: "POST",
        body: JSON.stringify({
          _source: ["id", "fullName"],
          query: { bool: { filter: [{ term: { id } }] } },
        }),
      }),
  });
  const fullNameFromIdref = data?.hits?.hits[0]?._source?.fullName || "";
  return { fullNameFromIdref, refetch };
};

// Landing pages d'un lot de publications.
export const useLandingPages = (publicationIds: string[] | string[][]) => {
  const ids = Array.isArray(publicationIds)
    ? (Array.isArray(publicationIds[0])
        ? publicationIds.flat()
        : publicationIds
      ).filter(Boolean)
    : [];

  const { data, isLoading, isError } = useQuery({
    queryKey: ["landingPages", ids.join(",")],
    queryFn: async () => {
      if (ids.length === 0) {
        return { hits: { hits: [] } };
      }

      return fetchJson(
        SCANR_PUBLICATIONS,
        {
          method: "POST",
          body: JSON.stringify({
            size: Math.min(10000, ids.length),
            _source: ["landingPage", "id"],
            query: {
              terms: { "id.keyword": ids },
            },
          }),
        },
        "Erreur réseau"
      );
    },
    enabled: ids.length > 0,
  });

  const landingPages = {};

  if (data?.hits?.hits) {
    data.hits.hits.forEach((hit) => {
      if (hit._source?.id && hit._source?.landingPage) {
        landingPages[hit._source.id] = hit._source.landingPage;
      }
    });
  }

  return {
    landingPages,
    isLoading: isLoading && ids.length > 0,
    isError,
  };
};
