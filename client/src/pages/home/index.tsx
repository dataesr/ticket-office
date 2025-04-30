import { Col, Container } from "@dataesr/dsfr-plus";
import SearchSection from "../contact-contributionbyobject-page/components/search-section";
import { useState } from "react";
import ContributionAllData from "../../api/contribution-api/getAllData";
import AllContributions from "./components/item";
import { ClipLoader } from "react-spinners";

const Home = () => {
  const [query, setQuery] = useState<string[]>([]);
  const [highlightedQuery, setHighlightedQuery] = useState<string>("");

  const { data, isLoading, isError } = ContributionAllData();

  const getFilteredData = () => {
    if (!data || data.length === 0) return [];
    const allItems = data.flatMap((item) => item.data || []);
    const combinedQuery = highlightedQuery || query.join(" ");

    if (combinedQuery.trim() !== "") {
      return allItems
        .filter(
          (item) =>
            item.name?.toLowerCase().includes(combinedQuery.toLowerCase()) ||
            item.email?.toLowerCase().includes(combinedQuery.toLowerCase()) ||
            item.message?.toLowerCase().includes(combinedQuery.toLowerCase()) ||
            item.id?.toLowerCase().includes(combinedQuery.toLowerCase())
        )
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    return allItems
      .filter((item) => new Date(item.created_at) >= twentyFourHoursAgo)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  };

  const filteredData = getFilteredData();

  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue !== "") {
      setQuery((prev) => [...prev, trimmedValue]);
      setHighlightedQuery(trimmedValue);
    } else {
      setQuery([]);
      setHighlightedQuery("");
    }
  };

  const handleRemoveQueryItem = (item: string) => {
    setQuery(query.filter((q) => q !== item));
    if (item === highlightedQuery) {
      setHighlightedQuery("");
    }
  };

  return (
    <Container className="fr-mt-10v">
      <Col className="fr-mb-3w">
        <i>
          Sans filtre, voici plus bas les contributions sur les dernières 24h.
        </i>
      </Col>
      <SearchSection
        query={query}
        handleSearch={handleSearch}
        handleRemoveQueryItem={handleRemoveQueryItem}
      />

      {isLoading ? (
        <div className="loading-container">
          <ClipLoader color="#123abc" size={50} />
        </div>
      ) : isError ? (
        <p>Oops... Une erreur est survenue.</p>
      ) : filteredData.length > 0 ? (
        <AllContributions data={filteredData} query={highlightedQuery} />
      ) : query.length > 0 ? (
        <p>Aucun résultat correspondant à votre recherche.</p>
      ) : null}
    </Container>
  );
};

export default Home;
