import { Badge, Col, Container, Link, Row, Text } from "@dataesr/dsfr-plus";
import "./styles.scss";
import { generateLinkFromAllDatas } from "./generate-links";
import {
  BadgeColor,
  BadgeStatus,
  StatusLabel,
  typeIcon,
  TypeLabel,
} from "../../../utils";
import { AllContributionsProps, Contribution } from "../../../types";
import MarkdownRenderer from "../../../utils/markdownRenderer";

const FormattedDate = ({ dateString }: { dateString: string }) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("fr-FR");
  const formattedTime = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Text size="sm">
      <i>
        Date de la contribution : {formattedDate} à {formattedTime}
      </i>
    </Text>
  );
};

const ContributionBadges = ({
  contribution,
}: {
  contribution: Contribution;
}) => {
  let badgeContent = "Contact";

  if (
    contribution.contributionType === "contribute_production" ||
    contribution.productions?.length > 0
  ) {
    badgeContent = "Lier des publications";
  } else if (
    contribution.contributionType === "contribute" ||
    (contribution.objectId && !contribution.productions)
  ) {
    badgeContent = "Contribution par objet";
  } else if (contribution.contributionType === "remove-user") {
    badgeContent = "Suppression de compte";
  } else if (contribution.contributionType === "update-user-data") {
    badgeContent = "Mise à jour de données";
  }

  const isFromScanR =
    contribution.fromApplication === "scanr" ||
    [
      "remove-user",
      "contact",
      "update-user-data",
      "contribute-object",
      "contribute_production",
    ].includes(contribution.contributionType || "");

  return (
    <div>
      {contribution?.objectType && (
        <Badge
          size="sm"
          icon={typeIcon({ icon: contribution.objectType })}
          color={BadgeColor({ type: contribution.objectType })}
          className="fr-mr-1w fr-mt-1w"
        >
          {TypeLabel({ type: contribution.objectType })}
        </Badge>
      )}

      {isFromScanR && (
        <Badge size="sm" className="fr-mr-1w fr-mb-1w" color="blue-ecume">
          scanR
        </Badge>
      )}

      <Badge size="sm" color="blue-ecume" className="fr-mr-1w fr-mb-1w">
        {badgeContent}
      </Badge>

      {contribution.fromApplication &&
        contribution.fromApplication !== "scanr" && (
          <Badge size="sm" color="blue-ecume" className="fr-mr-1w fr-mb-1w">
            {contribution.fromApplication}
          </Badge>
        )}

      <Badge
        size="sm"
        color={BadgeStatus({ status: contribution?.status })}
        className="fr-mr-1w fr-mb-1w"
      >
        {StatusLabel({ status: contribution.status })}
      </Badge>
    </div>
  );
};

const ContributionItem = ({
  contribution,
  index,
}: {
  contribution: Contribution;
  index: number;
}) => {
  const link = generateLinkFromAllDatas(
    contribution.collection || contribution.collectionName,
    contribution.fromApplication,
    contribution.id,
    contribution.objectId,
    contribution.productions,
    contribution.message,
    contribution.contributionType
  );

  return (
    <Row gutters key={index}>
      <Link
        href={link}
        rel="noopener noreferrer"
        className="contribution-content"
      >
        <Col lg="12" md="10" sm="12">
          <ContributionBadges contribution={contribution} />

          <div>
            <Text className="fr-mb-0">
              Contribution de{" "}
              <i>
                {contribution?.name || "Anonyme"} -{" "}
                {contribution?.email || "Pas d'email"}
              </i>
            </Text>

            <FormattedDate dateString={contribution.created_at} />

            {contribution?.message && (
              <Text size="sm">
                <MarkdownRenderer content={contribution.message} />
              </Text>
            )}
          </div>
        </Col>
      </Link>
    </Row>
  );
};

const AllContributions: React.FC<AllContributionsProps & { query: string }> = ({
  data,
}) => {
  return (
    <Container>
      {data.length === 0 ? (
        <p>Pas de résultat</p>
      ) : (
        data.map((contribution, index) => (
          <ContributionItem
            key={contribution.id || index}
            contribution={contribution}
            index={index}
          />
        ))
      )}
    </Container>
  );
};

export default AllContributions;
