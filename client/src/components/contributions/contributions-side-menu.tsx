import { Badge, Link, SideMenu, Text } from "@dataesr/dsfr-plus";
import {
  BadgeColor,
  BadgeStatus,
  StatusLabel,
  TypeLabel,
  typeIcon,
} from "../../utils";
import { Contribution } from "../../types";

type ContributionsSideMenuProps = {
  contributions: Contribution[];
  selectedId: string;
  onSelect: (id: string) => void;
};

const EXCERPT_LENGTH = 120;

const countResponses = (threads: Contribution["threads"]) =>
  threads?.reduce(
    (total, thread) =>
      total + thread.responses.filter((r) => r.responseMessage).length,
    0
  ) ?? 0;

const getExcerpt = (message = "") =>
  message.length > EXCERPT_LENGTH
    ? `${message.slice(0, EXCERPT_LENGTH)}…`
    : message;

const ContributionsSideMenu = ({
  contributions,
  selectedId,
  onSelect,
}: ContributionsSideMenuProps) => {
  const handleClick = (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    onSelect(id);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <SideMenu
      title="Contributions"
      aria-label="Contributions"
      fullHeight
    >
      {contributions.map((contribution, index) => {
        const responseCount = countResponses(contribution.threads);

        return (
          <Link
            key={`${contribution.id}-${index}`}
            href="#contribution-detail"
            current={contribution.id === selectedId}
            onClick={(event) => handleClick(event, contribution.id)}
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
          </Link>
        );
      })}
    </SideMenu>
  );
};

export default ContributionsSideMenu;
