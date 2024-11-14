import { Col, Container, Title } from "@dataesr/dsfr-plus";
import SearchSection from "../contact-contributionbyobject-page/components/search-section";
import { useState, useEffect } from "react";
import ContributionAllDatas from "../../api/contribution-api/getAllDatas";
import AllContributions from "./components/item";

const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
const prodUrl = import.meta.env.VITE_BASE_API_URL;

const url = isDevelopment ? "http://localhost:3000/api" : `${prodUrl}/api`;

const Home = () => {
  const [query, setQuery] = useState<string[]>([]);
  const [highlightedQuery, setHighlightedQuery] = useState<string>("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const { data, isLoading, isError } = ContributionAllDatas(url);

  useEffect(() => {
    if (data && data.length > 0) {
      const allItems = data.flatMap((item) => item.data || []);
      const combinedQuery = highlightedQuery || query.join(" ");

      if (combinedQuery.trim() !== "") {
        const filtered = allItems.filter((item) => {
          return (
            item.name?.toLowerCase().includes(combinedQuery.toLowerCase()) ||
            item.email?.toLowerCase().includes(combinedQuery.toLowerCase()) ||
            item.message?.toLowerCase().includes(combinedQuery.toLowerCase())
          );
        });

        const sortedFiltered = filtered.sort((a, b) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });

        setFilteredData(sortedFiltered);
      } else {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const recentContributions = allItems.filter((item) => {
          const createdAt = new Date(item.created_at);
          return createdAt >= twentyFourHoursAgo;
        });

        const sortedRecentContributions = recentContributions.sort((a, b) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });

        setFilteredData(sortedRecentContributions);
      }
    }
  }, [highlightedQuery, query, data]);

  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue !== "") {
      setQuery((prev) => [...prev, trimmedValue]);
      setHighlightedQuery(trimmedValue);
    } else {
      setQuery([]);
      setHighlightedQuery("");
      setFilteredData([]);
    }
  };

  const handleRemoveQueryItem = (item: string) => {
    setQuery(query.filter((q) => q !== item));
    if (item === highlightedQuery) {
      setHighlightedQuery("");
      setFilteredData([]);
    }
  };

  return (
    <Container className="fr-mt-10v">
      <Title>Bienvenue sur le Guichet numérique du DISD</Title>
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
      {filteredData.length > 0 ? (
        <AllContributions data={filteredData} query={highlightedQuery} />
      ) : (
        query.length > 0 && (
          <p>Aucun résultat correspondant à votre recherche.</p>
        )
      )}

      {isLoading && <p>Loading...</p>}
      {isError && <p>Oops...</p>}
    </Container>
  );
};

export default Home;
