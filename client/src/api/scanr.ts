import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "./utils/fetchJson";
import { AuthorData } from "../types";

const SCANR_PUBLICATIONS =
  "https://scanr.enseignementsup-recherche.gouv.fr/api/scanr-publications/_search";
const SCANR_PERSONS =
  "https://scanr.enseignementsup-recherche.gouv.fr/api/scanr-persons/_search";

export const usePublicationsData = (productionIds: string[]) => {
  const uniqueIds = [...new Set(productionIds.filter(Boolean))];

  const { data, isLoading, isError } = useQuery({
    queryKey: ["scanr-publications", uniqueIds.join(",")],
    queryFn: async () => {
      const result = await fetchJson(
        SCANR_PUBLICATIONS,
        {
          method: "POST",
          body: JSON.stringify({
            size: Math.min(10000, uniqueIds.length),
            _source: ["id", "authors", "landingPage"],
            query: {
              terms: { "id.keyword": uniqueIds },
            },
          }),
        },
        "Erreur réseau"
      );

      const authorsData: Record<string, AuthorData> = {};
      const landingPages: Record<string, string> = {};

      result.hits?.hits?.forEach((hit) => {
        const id = hit._source?.id || hit._id;
        if (!id) return;

        if (hit._source?.authors) {
          authorsData[id] = {
            fullName: hit._source.authors.map((author) => author?.fullName),
            firstName: hit._source.authors.map((author) => author?.firstName),
            lastName: hit._source.authors.map((author) => author?.lastName),
          };
        }
        if (hit._source?.landingPage) {
          landingPages[id] = hit._source.landingPage;
        }
      });

      return { authorsData, landingPages };
    },
    enabled: uniqueIds.length > 0,
  });

  return {
    authorsData: data?.authorsData || {},
    landingPages: data?.landingPages || {},
    isLoading: isLoading && uniqueIds.length > 0,
    isError,
  };
};

export const useIdrefNames = (idrefIds: string[]) => {
  const uniqueIds = [...new Set(idrefIds.filter(Boolean))];

  const { data, isLoading, isError } = useQuery({
    queryKey: ["scanr-persons-batch", uniqueIds.join(",")],
    queryFn: async () => {
      const result = await fetchJson(
        SCANR_PERSONS,
        {
          method: "POST",
          body: JSON.stringify({
            size: Math.min(10000, uniqueIds.length),
            _source: ["id", "fullName"],
            query: {
              terms: { "id.keyword": uniqueIds },
            },
          }),
        },
        "Erreur réseau"
      );

      const names: Record<string, string> = {};
      result.hits?.hits?.forEach((hit) => {
        const id = hit._source?.id || hit._id;
        if (id) names[id] = hit._source?.fullName || "";
      });

      return names;
    },
    enabled: uniqueIds.length > 0,
  });

  return {
    idrefNames: data || {},
    isLoading: isLoading && uniqueIds.length > 0,
    isError,
  };
};
