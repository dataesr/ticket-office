import { Badge, Col, Container, Link, Row, Text } from "@dataesr/dsfr-plus";
import "./styles.scss";
import { AllContributionsProps } from "../../../types";
import { generateLinkFromAllDatas } from "./generate-links";
import {
  BadgeColor,
  BadgeStatus,
  StatusLabel,
  typeIcon,
  TypeLabel,
} from "../../../utils";

const AllContributions: React.FC<AllContributionsProps & { query: string }> = ({
  data,
  query,
}) => {
  const highlightQuery = (text: string, query: string) => {
    if (!query) return text;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "gi");

    return text?.replace(regex, '<span class="highlight">$1</span>');
  };

  return (
    <Container>
      {data.length === 0 ? (
        <p>Pas de résultat</p>
      ) : (
        data?.map((contribution, index) => {
          const link = generateLinkFromAllDatas(
            contribution.collectionName,
            contribution.fromApplication,
            contribution.id,
            contribution.objectId,
            contribution.productions,
            contribution.message
          );
          const creationDate = new Date(contribution.created_at);
          const formattedDate = creationDate.toLocaleDateString("fr-FR");
          const formattedTime = creationDate.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          });

          let badgeContent = "";
          if (contribution.productions?.length > 0) {
            badgeContent = "Lier des publications";
          } else if (contribution.objectId && !contribution.productions) {
            badgeContent = "Contribution par objet";
          } else badgeContent = "Contact";

          return (
            <Row gutters key={index}>
              <Link
                href={link}
                rel="noopener noreferrer"
                className="contribution-content"
              >
                <Col lg="12" md="10" sm="12">
                  <div>
                    {badgeContent && (
                      <Badge
                        size="sm"
                        color="blue-ecume"
                        className="fr-mr-1w fr-mb-1w"
                      >
                        {badgeContent}
                      </Badge>
                    )}
                    {badgeContent === "Lier des publications" && (
                      <Badge
                        size="sm"
                        className="fr-mr-1w fr-mb-1w"
                        color="blue-ecume"
                      >
                        scanR
                      </Badge>
                    )}
                    {contribution.fromApplication && (
                      <Badge
                        size="sm"
                        color="blue-ecume"
                        className="fr-mr-1w fr-mb-1w"
                      >
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
                    {contribution?.objectType && (
                      <>
                        <Badge
                          size="sm"
                          icon={typeIcon({ icon: contribution.objectType })}
                          color={BadgeColor({ type: contribution.objectType })}
                          className="fr-mr-1w fr-mb-1w"
                        >
                          {TypeLabel({ type: contribution.objectType })}
                        </Badge>
                        <Badge
                          size="sm"
                          className="fr-mr-1w fr-mb-1w"
                          color="blue-ecume"
                        >
                          scanR
                        </Badge>
                      </>
                    )}
                    {contribution?.comment ||
                      (contribution?.team?.length > 0 && (
                        <Badge
                          size="sm"
                          color="green-emeraude"
                          className="fr-mr-1w fr-mb-1w"
                        >
                          {`Traité par ${contribution.team[0]}`}
                        </Badge>
                      ))}
                  </div>
                  <div>
                    <Text className="fr-mb-0 ">
                      Contribution de{" "}
                      <i>
                        {contribution?.name} - {contribution?.email}
                      </i>
                    </Text>
                    <Text size="sm">
                      <i>
                        Date de la contribution : {formattedDate} à{" "}
                        {formattedTime}
                      </i>
                    </Text>
                    <Text
                      size="sm"
                      dangerouslySetInnerHTML={{
                        __html: highlightQuery(contribution?.message, query),
                      }}
                    />
                  </div>
                </Col>
              </Link>
            </Row>
          );
        })
      )}
    </Container>
  );
};

export default AllContributions;
