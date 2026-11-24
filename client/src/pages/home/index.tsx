import { useMemo, useState } from "react";
import { Alert, Container, Text } from "@dataesr/dsfr-plus";
import Loader from "../../components/loader";
import SearchSection from "../../components/search-section";
import { ContributionAllData } from "../../api/contributions";
import AllContributions from "./components/item";
import { filterContributions } from "./utils";
import "./styles.scss";

const Home = () => {
  const [query, setQuery] = useState<string[]>([]);
  const [highlightedQuery, setHighlightedQuery] = useState("");

  const search = highlightedQuery || query.join(" ");
  const hasActiveSearch = search.trim().length > 0;

  const { data, isLoading, isError } = ContributionAllData(search.trim());

  const filteredData = useMemo(() => {
    const items = (data ?? []).flatMap((route) => route.data || []);
    return filterContributions(items, search);
  }, [data, search]);

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
      return <Loader />;
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
