import React, { useState } from "react";
import { Badge, Col, Text, Title } from "@dataesr/dsfr-plus";
import { FaCopy } from "react-icons/fa";
import "./styles.scss";
import { LastMailsSentProps } from "../../../types";
import collectionNameMapping, { generateLink } from "./utils";

const LastMailsSentItem: React.FC<LastMailsSentProps> = ({ data }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <>
      {data.emails.map((email, index) => {
        const link = generateLink(
          email.collectionName,
          email.fromApplication,
          email.contributionId
        );

        const sentDate = new Date(email.sentAt);
        const formattedDate = sentDate.toLocaleDateString("fr-FR");
        const formattedTime = sentDate.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <Col key={index} className="email-item fr-mb-2w">
            <div className="badges">
              <Badge
                size="sm"
                color="green-menthe"
                className="fr-mr-1w fr-mb-1w"
              >
                {collectionNameMapping[email.collectionName]}
              </Badge>

              {email.fromApplication && (
                <Badge
                  size="sm"
                  color="blue-ecume"
                  className="fr-mr-1w fr-mb-1w"
                >
                  {email.fromApplication}
                </Badge>
              )}
            </div>

            <div className="email-content">
              <Title look="h6" as="h3" className="fr-mb-0">
                Réponse de <i>{email.selectedProfile}</i> à{" "}
                <i>
                  {email?.name} ({email?.to})
                </i>
              </Title>
              <Text size="sm">
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <i>{email?.contributionId}</i>
                </a>
                <button
                  className={`copy-button ${
                    copiedId === email.contributionId ? "copied" : ""
                  }`}
                  onClick={() => copyToClipboard(email.contributionId)}
                  title="Copier l'ID"
                >
                  {copiedId === email.contributionId && (
                    <span className="copied-text">Copié</span>
                  )}
                  <FaCopy size={14} color="#2196f3" className="copy-icon" />
                </button>
              </Text>
              <Text size="sm">
                <i>
                  Envoyé le {formattedDate} à {formattedTime}
                </i>
              </Text>
              <Text>{email.userResponse}</Text>
            </div>
          </Col>
        );
      })}
    </>
  );
};

export default LastMailsSentItem;
