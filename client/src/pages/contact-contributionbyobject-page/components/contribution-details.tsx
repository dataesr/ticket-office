import { Text } from "@dataesr/dsfr-plus";
import { Contribution } from "../../../types";
import ContributionItem from "./contribution-item";

const ContributionDetails: React.FC<{
  filteredContributions: Contribution[];
  selectedContribution: string;
  refetch: () => void;
  highlightedQuery: string;
  allTags: string[];
  url: string;
}> = ({
  filteredContributions,
  selectedContribution,
  refetch,
  highlightedQuery,
  allTags,
  url,
}) =>
  filteredContributions && filteredContributions.length > 0 ? (
    <ContributionItem
      allTags={allTags}
      key={selectedContribution}
      data={filteredContributions.find(
        (contribution) => contribution?.id === selectedContribution
      )}
      refetch={refetch}
      highlightedQuery={highlightedQuery}
      url={url}
    />
  ) : (
    <Text>Aucune contribution trouvée.</Text>
  );

export default ContributionDetails;
