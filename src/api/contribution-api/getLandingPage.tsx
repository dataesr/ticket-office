import { useQuery } from "@tanstack/react-query";
import { postHeaders } from "../../config/api";
import { Publication } from "../../types";

const LandingPage = (id: string) => {
  const fetchContributions = async (): Promise<Publication> => {
    const response = await fetch(
      "https://scanr.enseignementsup-recherche.gouv.fr/api/scanr-publications/_search",
      {
        method: "POST",
        headers: postHeaders,
        body: JSON.stringify({
          _source: ["landingPage"],
          query: {
            match: { id: id },
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  };

  const { data, error, isLoading } = useQuery(
    ["contributions", id],
    fetchContributions
  );

  const landingPage = data?.hits?.hits?.[0]?._source.landingPage;

  return { landingPage, isLoading, error };
};

export default LandingPage;
