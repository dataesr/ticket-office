import { useMemo, useState } from "react";
import { Col, Container } from "@dataesr/dsfr-plus";
import { ClipLoader } from "react-spinners";
import SearchSection from "../../components/search-section";
import { ContributionAllData } from "../../api/contributions";
import AllContributions from "./components/item";
import { filterContributions } from "./utils";

const LOADER_COLOR = "var(--blue-france-sun-113-625)";

const Home = () => {
  const [query, setQuery] = useState<string[]>([]);
  const [highlightedQuery, setHighlightedQuery] = useState("");

  const { data, isLoading, isError } = ContributionAllData();

  const filteredData = useMemo(() => {
    const items = (data ?? []).flatMap((route) => route.data || []);
    return filterContributions(items, highlightedQuery || query.join(" "));
  }, [data, highlightedQuery, query]);

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    if (trimmed) {
      setQuery((prev) => [...prev, trimmed]);
      setHighlightedQuery(trimmed);
    } else {
      setQuery([]);
      setHighlightedQuery("");
    }
  };

  const handleRemoveQueryItem = (item: string) => {
    setQuery((prev) => prev.filter((q) => q !== item));
    if (item === highlightedQuery) setHighlightedQuery("");
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
          <ClipLoader color={LOADER_COLOR} size={50} />
        </div>
      ) : isError ? (
        <p>Oops... Une erreur est survenue.</p>
      ) : filteredData.length > 0 ? (
        <AllContributions data={filteredData} />
      ) : query.length > 0 ? (
        <p>Aucun résultat correspondant à votre recherche.</p>
      ) : null}
    </Container>
  );
};

export default Home;
