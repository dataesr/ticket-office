import { useQuery } from "@tanstack/react-query";
import { postHeaders } from "../../config/api";

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

      const response = await fetch(
        "https://scanr.enseignementsup-recherche.gouv.fr/api/scanr-publications/_search",
        {
          method: "POST",
          headers: postHeaders,
          body: JSON.stringify({
            size: Math.min(10000, ids.length),
            _source: ["landingPage", "id"],
            query: {
              terms: { "id.keyword": ids },
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur réseau");
      }

      return response.json();
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

export default useLandingPages;
