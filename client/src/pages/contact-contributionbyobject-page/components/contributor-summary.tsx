import { useId } from "react";
import Badge from "../../../components/badge";
import {
  BadgeColor,
  BadgeStatus,
  StatusLabel,
  TypeLabel,
  typeIcon,
} from "../../../utils";
import { ContributorSummaryProps } from "../../../types";

const ContributorSummary: React.FC<ContributorSummaryProps> = ({
  contributions,
  onSelectContribution,
}) => {
  const collapseId = useId();

  const handleClick = (id: string) => {
    onSelectContribution(id);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleKeyDown = (event: React.KeyboardEvent, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick(id);
    }
  };

  return (
    <nav
      className="fr-sidemenu fr-sidemenu--sticky-full-height"
      aria-label="Contributeurs"
    >
      <div className="fr-sidemenu__inner">
        <button
          className="fr-sidemenu__btn"
          type="button"
          aria-controls={collapseId}
          aria-expanded="false"
        >
          {`Contributeurs (${contributions.length})`}
        </button>
        <div className="fr-collapse" id={collapseId}>
          <div className="fr-sidemenu__title">Contributeurs</div>
          <ul className="fr-sidemenu__list">
            {contributions.map((contribution, index) => (
              <li
                className="fr-sidemenu__item"
                key={`${contribution.id}-${index}`}
              >
                <div
                  className="fr-sidemenu__link"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleClick(contribution?.id)}
                  onKeyDown={(e) => handleKeyDown(e, contribution?.id)}
                >
                  {(contribution?.type ||
                    contribution?.status ||
                    contribution?.tags?.length > 0) && (
                    <ul className="fr-badges-group fr-mb-1w">
                      {contribution?.type && (
                        <li>
                          <Badge
                            icon={typeIcon({ icon: contribution.type })}
                            color={BadgeColor({ type: contribution.type })}
                          >
                            {TypeLabel({ type: contribution.type })}
                          </Badge>
                        </li>
                      )}
                      {contribution?.status && (
                        <li>
                          <Badge
                            color={BadgeStatus({
                              status: contribution?.status,
                            })}
                          >
                            {StatusLabel({ status: contribution.status })}
                          </Badge>
                        </li>
                      )}
                      {contribution?.tags
                        ?.filter((tag) => tag !== "")
                        .map((tag) => (
                          <li key={tag}>
                            <Badge color="green-menthe">{tag}</Badge>
                          </li>
                        ))}
                    </ul>
                  )}
                  <p className="fr-text--sm fr-mb-1v">
                    {contribution.name}{" "}
                    {new Date(contribution.created_at).toLocaleDateString()}
                  </p>
                  <p className="fr-text--sm fr-text-mention--grey fr-mb-0 contribution-message">
                    {contribution.message}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default ContributorSummary;
