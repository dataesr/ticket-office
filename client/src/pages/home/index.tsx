import { useMemo, useState } from "react";
import { Alert, Container, Spinner, Text } from "@dataesr/dsfr-plus";
import SearchSection from "../../components/search-section";
import { ContributionAllData } from "../../api/contributions";
import AllContributions from "./components/item";
import { filterContributions } from "./utils";
import "./styles.scss";

const Home = () => {
  const [query, setQuery] = useState<string[]>([]);
  const [highlightedQuery, setHighlightedQuery] = useState("");

  const { data, isLoading, isError } = ContributionAllData();

  const filteredData = useMemo(() => {
    const items = (data ?? []).flatMap((route) => route.data || []);
    return filterContributions(items, highlightedQuery || query.join(" "));
  }, [data, highlightedQuery, query]);

  const hasActiveSearch =
    query.length > 0 || highlightedQuery.trim().length > 0;

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

  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="fr-grid-row fr-grid-row--center fr-py-12w">
          <Spinner size={48} />
        </div>
      );
    }

    if (isError) {
      return (
        <Alert
          variant="error"
          closeMode="disallow"
          title="Une erreur est survenue"
          description="Impossible de charger les contributions pour le moment. Veuillez réessayer plus tard."
        />
      );
    }

    if (filteredData.length === 0) {
      return (
        <Alert
          variant="info"
          closeMode="disallow"
          title={
            hasActiveSearch ? "Aucun résultat" : "Aucune contribution récente"
          }
          description={
            hasActiveSearch
              ? "Aucune contribution ne correspond à votre recherche."
              : "Aucune contribution n'a été reçue sur les dernières 24 heures."
          }
        />
      );
    }

    return (
      <>
        <Text as="p" size="sm" className="fr-mb-2w fr-text-mention--grey">
          {filteredData.length} contribution{filteredData.length > 1 ? "s" : ""}
        </Text>
        <AllContributions data={filteredData} />
      </>
    );
  };

  return (
    <main id="content">
      <Container fluid className="home-header__wrapper">
        <Container className="fr-py-8w">
          <h1 className="fr-mb-1w">Bureau des contributions</h1>
          <p className="fr-mb-5w fr-text--sm">
            Recherchez et traitez les contributions reçues via scanR et le BSO.
            Sans recherche active, seules les contributions des dernières 24
            heures sont affichées.
          </p>
          <SearchSection
            query={query}
            handleSearch={handleSearch}
            handleRemoveQueryItem={handleRemoveQueryItem}
          />
        </Container>
      </Container>
      <Container className="fr-py-6w">{renderResults()}</Container>
    </main>
  );
};

export default Home;
