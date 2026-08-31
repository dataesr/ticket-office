import { Badge, Link, Text } from "@dataesr/dsfr-plus";
import "./styles.scss";
import { generateLinkFromAllDatas } from "../utils";
import {
  BadgeColor,
  BadgeStatus,
  StatusLabel,
  typeIcon,
  TypeLabel,
} from "../../../utils";
import { UnifiedContribution } from "../../../types";

import MarkdownRenderer from "../../../utils/markdownRenderer";
import { formatDate, formatTime } from "../../../utils/format-date";

type ContributionBadgesProps = { contribution: UnifiedContribution };
type ContributionItemProps = { contribution: UnifiedContribution; index: number };
type AllContributionsProps = { data: UnifiedContribution[]; query?: string };

const getContributionTitle = (contribution: UnifiedContribution): string =>
  contribution.name ||
  contribution.contact?.email ||
  contribution.email ||
  "Contribution";

const ContributionBadges = ({ contribution }: ContributionBadgesProps) => {
  let badgeContent = "Contact";

  const contributionType = contribution.contributionType || "";
  const hasProductions =
    Array.isArray(contribution.productions) &&
    contribution.productions.length > 0;
  const hasObjectId = Boolean(contribution.objectId);

  if (contributionType === "contribute_production" || hasProductions) {
    badgeContent = "Lier des publications";
  } else if (
    contributionType === "contribute" ||
    (hasObjectId && !hasProductions)
  ) {
    badgeContent = "Contribution par objet";
  } else if (contributionType === "remove-user") {
    badgeContent = "Suppression de compte";
  } else if (contributionType === "update-user-data") {
    badgeContent = "Mise à jour de données";
  } else if (contribution.csv) {
    badgeContent = "Demande de BSO Local";
  }

  const isFromScanR =
    contribution.fromApplication === "scanr" ||
    [
      "remove-user",
      "contact",
      "update-user-data",
      "contribute-object",
      "production",
    ].includes(contributionType);

  return (
    <ul className="fr-badges-group">
      {contribution.objectType && (
        <li>
          <Badge
            size="sm"
            icon={typeIcon({ icon: contribution.objectType })}
            color={BadgeColor({ type: contribution.objectType })}
          >
            {TypeLabel({ type: contribution.objectType })}
          </Badge>
        </li>
      )}
      {isFromScanR && (
        <li>
          <Badge size="sm" color="blue-ecume">
            scanR
          </Badge>
        </li>
      )}
      <li>
        <Badge size="sm" color="blue-ecume">
          {badgeContent}
        </Badge>
      </li>
      {contribution.fromApplication &&
        contribution.fromApplication !== "scanr" && (
          <li>
            <Badge size="sm" color="blue-ecume">
              {contribution.fromApplication}
            </Badge>
          </li>
        )}
      {contribution?.csv && (
        <li>
          <Badge size="sm" color="green-menthe">
            BSO
          </Badge>
        </li>
      )}
      <li>
        <Badge size="sm" color={BadgeStatus({ status: contribution?.status })}>
          {StatusLabel({ status: contribution.status })}
        </Badge>
      </li>
    </ul>
  );
};

const ContributionItem = ({ contribution }: ContributionItemProps) => {
  const link = generateLinkFromAllDatas(
    contribution.fromApplication || "",
    contribution.id,
    contribution.objectId,
    contribution.productions
      ? JSON.stringify(contribution.productions)
      : undefined,
    contribution.message,
    contribution.contributionType,
    !!contribution.csv
  );

  return (
    <div className="fr-card fr-card--no-icon fr-mb-3w home-contribution-card">
      <div className="fr-card__body">
        <div className="fr-card__content">
          <div className="fr-card__start">
            <ContributionBadges contribution={contribution} />
          </div>
          <h2 className="fr-card__title">
            <Link href={link} rel="noopener noreferrer">
              {getContributionTitle(contribution)}
            </Link>
          </h2>
          <div className="fr-card__desc">
            {contribution?.email && (
              <Text as="p" size="sm" className="fr-mb-1w">
                {contribution.email}
              </Text>
            )}
            {contribution?.contact?.email && (
              <Text as="p" size="sm" className="fr-mb-1w">
                Mail du demandeur : <strong>{contribution.contact.email}</strong>
              </Text>
            )}
            {contribution?.message && (
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

const AllContributions = ({ data }: AllContributionsProps) => (
  <section aria-label="Liste des contributions">
    {data.map((contribution, index) => (
      <ContributionItem
        key={contribution.id || index}
        contribution={contribution}
        index={index}
      />
    ))}
  </section>
);

export default AllContributions;
