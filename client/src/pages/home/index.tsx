import { useMemo, useState } from "react";
import { Container } from "@dataesr/dsfr-plus";
import PageBanner from "../../components/page-banner";
import SearchSection from "../../components/search-section";
import { ContributionAllData } from "../../api/contributions";
import Results from "./components/results";
import { filterContributions } from "./utils";

const Home = () => {
  const [query, setQuery] = useState<string[]>([]);
  const [highlightedQuery, setHighlightedQuery] = useState("");

  const search = highlightedQuery || query.join(" ");
  const hasActiveSearch = search.trim().length > 0;

  const { data, isLoading, isError } = ContributionAllData(search.trim());

  const filteredData = useMemo(
    () => filterContributions(data ?? [], search),
    [data, search]
  );

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
    <main id="content">
      <PageBanner
        title="Bureau des contributions"
        description="Recherchez et traitez les contributions reçues via scanR et le BSO. Sans recherche active, seules les contributions des dernières 24 heures sont affichées."
      >
        <SearchSection
          query={query}
          handleSearch={handleSearch}
          handleRemoveQueryItem={handleRemoveQueryItem}
        />
      </PageBanner>
      <Container className="fr-py-6w">
        <Results
          contributions={filteredData}
          isLoading={isLoading}
          isError={isError}
          hasActiveSearch={hasActiveSearch}
        />
      </Container>
    </main>
  );
};

export default Home;
