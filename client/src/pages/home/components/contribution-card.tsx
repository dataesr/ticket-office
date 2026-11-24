import { Link, Text } from "@dataesr/dsfr-plus";
import "./styles.scss";
import MarkdownRenderer from "../../../components/markdown-renderer";
import { UnifiedContribution } from "../../../types";
import { getContributionLink } from "../../../utils/contribution-links";
import { formatDate, formatTime } from "../../../utils/format-date";
import { getContributionTitle } from "../utils";
import ContributionBadges from "./contribution-badges";

type ContributionCardProps = { contribution: UnifiedContribution };

const ContributionCard = ({ contribution }: ContributionCardProps) => {
  const link = getContributionLink(
    contribution.collectionName,
    contribution.fromApplication,
    contribution.id
  );

  return (
    <div className="fr-card fr-card--no-icon fr-mb-3w home-contribution-card">
      <div className="fr-card__body">
        <div className="fr-card__content">
          <div className="fr-card__start">
            <ContributionBadges contribution={contribution} />
          </div>
          <h2 className="fr-card__title">
            <Link href={link}>{getContributionTitle(contribution)}</Link>
          </h2>
          <div className="fr-card__desc">
            {contribution.email && (
              <Text as="p" size="sm" className="fr-mb-1w">
                {contribution.email}
              </Text>
            )}
            {contribution.contact?.email && (
              <Text as="p" size="sm" className="fr-mb-1w">
                Mail du demandeur :{" "}
                <strong>{contribution.contact.email}</strong>
              </Text>
            )}
            {contribution.message && (
              <div className="fr-text--sm">
                <MarkdownRenderer content={contribution.message} />
              </div>
            )}
          </div>
          <div className="fr-card__end">
            <p className="fr-card__detail fr-icon-calendar-line">
              {formatDate(contribution.created_at)} à{" "}
              {formatTime(contribution.created_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionCard;
