import { useQuery } from "@tanstack/react-query";
import { postHeaders } from "../../config/api";

const NameFromIdref = (id: string) => {
  const url =
    "https://scanr.enseignementsup-recherche.gouv.fr/api/scanr-persons/_search";

  const fetchContributions = async () => {
    const body = {
      _source: ["id", "fullName"],
      query: {
        bool: {
          filter: [
            {
              term: {
                id: id,
              },
            },
          ],
        },
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: postHeaders,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, refetch } = useQuery({
    queryKey: [url, id],
    queryFn: fetchContributions,
  });
  const fullNameFromIdref = data?.hits?.hits[0]?._source?.fullName || "";
  return { fullNameFromIdref, refetch };
};

export default NameFromIdref;
