import React, { useState } from "react";
import { Badge, Col, Container, Link, Row, Text } from "@dataesr/dsfr-plus";
import { FaCopy } from "react-icons/fa";
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const highlightQuery = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text?.replace(regex, '<span class="highlight">$1</span>');
  };

  return (
    <Container>
      {data.length === 0 ? (
        <p>Pas de résultat</p>
      ) : (
        data?.map((email, index) => {
          const link = generateLinkFromAllDatas(
            email.collectionName,
            email.fromApplication,
            email.id,
            email.objectId,
            email.productions
          );
          const creationDate = new Date(email.created_at);
          const formattedDate = creationDate.toLocaleDateString("fr-FR");
          const formattedTime = creationDate.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          });

          let badgeContent = "";
          if (email.productions?.length > 1) {
            badgeContent = "Lier des publications";
          } else if (email.objectId && !email.productions) {
            badgeContent = "Contribution par objet";
          } else badgeContent = "Contact";

          return (
            <Row gutters key={index} className="email-row">
              <Col lg="12" md="10" sm="12" className="email-item fr-mb-2w">
                <div className="badges">
                  {badgeContent && (
                    <Badge
                      size="sm"
                      color="blue-ecume"
                      className="fr-mr-1w fr-mb-1w"
                    >
                      {badgeContent}
                    </Badge>
                  )}
                  {email.fromApplication && (
                    <Badge
                      size="sm"
                      color="blue-ecume"
                      className="fr-mr-1w fr-mb-1w"
                    >
                      {email.fromApplication}
                    </Badge>
                  )}
                  <Badge
                    size="sm"
                    color={BadgeStatus({ status: email?.status })}
                    className="fr-mr-1w fr-mb-1w"
                  >
                    {StatusLabel({ status: email.status })}
                  </Badge>
                  {email?.type && (
                    <Badge
                      size="sm"
                      icon={typeIcon({ icon: email.type })}
                      color={BadgeColor({ type: email.type })}
                      className="fr-mr-1w fr-mb-1w"
                    >
                      {TypeLabel({ type: email.type })}
                    </Badge>
                  )}
                  {email?.comment ||
                    (email?.team?.length > 0 && (
                      <Badge
                        size="sm"
                        color="green-emeraude"
                        className="fr-mr-1w fr-mb-1w"
                      >
                        {`Traité par ${email.team[0]}`}
                      </Badge>
                    ))}
                </div>
                <div>
                  <Text className="fr-mb-0">
                    Contribution de{" "}
                    <i>
                      {email?.name} - {email?.email}
                    </i>
                  </Text>
                  <Text size="sm">
                    <Link href={link} rel="noopener noreferrer">
                      Voir la contribution <i>{email?.id}</i>
                    </Link>
                    <button
                      className={`copy-button ${
                        copiedId === email.id ? "copied" : ""
                      }`}
                      onClick={() => copyToClipboard(email.id)}
                      title="Copier l'ID"
                    >
                      {copiedId === email.id && (
                        <span className="copied-text">Copié</span>
                      )}
                      <FaCopy size={14} color="#2196f3" className="copy-icon" />
                    </button>
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
                      __html: highlightQuery(email?.message, query),
                    }}
                  />
                </div>
              </Col>
            </Row>
          );
        })
      )}
    </Container>
  );
};

export default AllContributions;
