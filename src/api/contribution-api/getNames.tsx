import { useQuery } from "@tanstack/react-query";
import { postHeaders } from "../../config/api";

const NameFromScanr = (id) => {
  const url =
    "https://scanr.enseignementsup-recherche.gouv.fr/api/scanr-publications/_search";

  const fetchContributions = async () => {
    const body = {
      _source: ["authors"],
      query: {
        bool: {
          filter: [
            {
              term: {
                "id.keyword": id,
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

  const { data, isLoading, isError, refetch } = useQuery(
    [url, id],
    fetchContributions
  );
  const fullName =
    data?.hits?.hits[0]?._source?.authors.map((author) => author.fullName) ||
    [];
  const firstName =
    data?.hits?.hits[0]?._source?.authors.map((author) => author.firstName) ||
    [];

  const lastName =
    data?.hits?.hits[0]?._source?.authors.map((author) => author.lastName) ||
    [];

  return { fullName, firstName, lastName, isLoading, isError, refetch };
};

export default NameFromScanr;
