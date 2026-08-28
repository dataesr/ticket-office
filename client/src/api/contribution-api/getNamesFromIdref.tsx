import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "../utils/fetchJson";

const NameFromIdref = (id: string) => {
  const url =
    "https://scanr.enseignementsup-recherche.gouv.fr/api/scanr-persons/_search";

  const { data, refetch } = useQuery({
    queryKey: [url, id],
    queryFn: () =>
      fetchJson(url, {
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

export default NameFromIdref;
