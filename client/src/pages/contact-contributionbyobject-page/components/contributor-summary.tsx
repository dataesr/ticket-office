import Badge from "../../../components/badge";
import {
  BadgeColor,
  BadgeStatus,
  StatusLabel,
  TypeLabel,
  typeIcon,
} from "../../../utils";
import { ContributorSummaryProps } from "../../../types";

const countResponses = (
  threads?: ContributorSummaryProps["contributions"][number]["threads"]
) =>
  threads?.reduce(
    (total, thread) =>
      total + thread.responses.filter((r) => r.responseMessage).length,
    0
  ) ?? 0;

const ContributorSummary: React.FC<ContributorSummaryProps> = ({
  contributions,
  selectedContribution,
  onSelectContribution,
}) => {
  const handleClick = (id: string) => {
    onSelectContribution(id);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <nav aria-label="Contributions" className="contribution-list">
      <p className="fr-text--sm fr-text--bold fr-mb-0 contribution-list__header">
        {`Contributions (${contributions.length})`}
      </p>
      <ul className="contribution-list__items">
        {contributions.map((contribution, index) => {
          const isSelected = contribution.id === selectedContribution;
          const responseCount = countResponses(contribution.threads);

          return (
            <li key={`${contribution.id}-${index}`}>
              <button
                type="button"
                className={`contribution-list__item${isSelected ? " contribution-list__item--selected" : ""}`}
                aria-current={isSelected ? "true" : undefined}
                onClick={() => handleClick(contribution.id)}
              >
                <span className="contribution-list__item-row">
                  <span className="fr-text--sm fr-text--bold fr-mb-0 contribution-list__item-name">
                    {contribution.name}
                  </span>
                  <span className="fr-text--xs fr-text-mention--grey fr-mb-0">
                    {new Date(contribution.created_at).toLocaleDateString()}
                  </span>
                </span>

                <span className="contribution-list__item-badges">
                  {contribution.status && (
                    <Badge color={BadgeStatus({ status: contribution.status })}>
                      {StatusLabel({ status: contribution.status })}
                    </Badge>
                  )}
                  {contribution.type && (
                    <Badge
                      icon={typeIcon({ icon: contribution.type })}
                      color={BadgeColor({ type: contribution.type })}
                    >
                      {TypeLabel({ type: contribution.type })}
                    </Badge>
                  )}
                  <span className="fr-text--xs fr-text-mention--grey fr-mb-0">
                    {responseCount > 0
                      ? `${responseCount} réponse${responseCount > 1 ? "s" : ""}`
                      : "Sans réponse"}
                  </span>
                </span>

                <p className="fr-text--xs fr-text-mention--grey fr-mb-0 contribution-list__item-excerpt">
                  {contribution.message}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default ContributorSummary;
