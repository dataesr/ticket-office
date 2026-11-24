import { Alert, Text } from "@dataesr/dsfr-plus";
import Loader from "../../../components/loader";
import { UnifiedContribution } from "../../../types";
import ContributionCard from "./contribution-card";

type ResultsProps = {
  contributions: UnifiedContribution[];
  isLoading: boolean;
  isError: boolean;
  hasActiveSearch: boolean;
};

const Results = ({
  contributions,
  isLoading,
  isError,
  hasActiveSearch,
}: ResultsProps) => {
  if (isLoading) return <Loader />;

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

  if (contributions.length === 0) {
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
        {contributions.length} contribution{contributions.length > 1 ? "s" : ""}
      </Text>
      <section aria-label="Liste des contributions">
        {contributions.map((contribution, index) => (
          <ContributionCard
            key={contribution.id || index}
            contribution={contribution}
          />
        ))}
      </section>
    </>
  );
};

export default Results;
