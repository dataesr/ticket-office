import ContributionItem from "./contribution-item";
import { ContributionDetailsProps } from "../../../types";

const ContributionDetails: React.FC<ContributionDetailsProps> = ({
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
    <p>Aucune contribution trouvée.</p>
  );

export default ContributionDetails;
