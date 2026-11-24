import { Badge, Text } from "@dataesr/dsfr-plus";
import {
  BadgeColor,
  BadgeStatus,
  StatusLabel,
  TypeLabel,
  typeIcon,
} from "../../utils";
import { Contribution } from "../../types";

type ContributionListProps = {
  contributions: Contribution[];
  selectedId: string;
  onSelect: (id: string) => void;
};

const countResponses = (threads: Contribution["threads"]) =>
  threads?.reduce(
    (total, thread) =>
      total + thread.responses.filter((r) => r.responseMessage).length,
    0
  ) ?? 0;

const EXCERPT_LENGTH = 120;

const getExcerpt = (message = "") =>
  message.length > EXCERPT_LENGTH
    ? `${message.slice(0, EXCERPT_LENGTH)}…`
    : message;

const ContributionList = ({
  contributions,
  selectedId,
  onSelect,
}: ContributionListProps) => {
  const handleClick = (id: string) => {
    onSelect(id);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <nav aria-label="Contributions" className="fr-sidemenu">
      <div className="fr-sidemenu__inner">
        <div className="fr-sidemenu__title">
          {`Contributions (${contributions.length})`}
        </div>
        <ul className="fr-sidemenu__list">
          {contributions.map((contribution, index) => {
            const isSelected = contribution.id === selectedId;
            const responseCount = countResponses(contribution.threads);

            return (
              <li
                className="fr-sidemenu__item"
                key={`${contribution.id}-${index}`}
              >
                <button
                  type="button"
                  className="fr-sidemenu__btn"
                  aria-current={isSelected ? "true" : undefined}
                  onClick={() => handleClick(contribution.id)}
                >
                  <span>
                    {contribution.name}
                    <br />
                    {contribution.status && (
                      <Badge
                        size="sm"
                        className="fr-mr-1v"
                        color={BadgeStatus({ status: contribution.status })}
                      >
                        {StatusLabel({ status: contribution.status })}
                      </Badge>
                    )}
                    {contribution.type && (
                      <Badge
                        size="sm"
                        icon={typeIcon({ icon: contribution.type })}
                        color={BadgeColor({ type: contribution.type })}
                      >
                        {TypeLabel({ type: contribution.type })}
                      </Badge>
                    )}
                    <br />
                    <Text
                      as="span"
                      size="xs"
                      className="fr-text--regular fr-text-mention--grey"
                    >
                      {new Date(contribution.created_at).toLocaleDateString()}
                      {" · "}
                      {responseCount > 0
                        ? `${responseCount} réponse${responseCount > 1 ? "s" : ""}`
                        : "Sans réponse"}
                      <br />
                      {getExcerpt(contribution.message)}
                    </Text>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default ContributionList;
