import React, { useState } from "react";
import { Badge, Col, Link, Text } from "@dataesr/dsfr-plus";
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
      {data.emails
        .slice()
        .sort(
          (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
        )
        .map((email, index) => {
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
                <Text className="fr-mb-0">
                  Réponse de{" "}
                  <strong>
                    <i>{email.selectedProfile}</i>
                  </strong>{" "}
                  à{" "}
                  <strong>
                    <i>
                      {email?.name} ({email?.to})
                    </i>
                  </strong>
                </Text>
                <Text size="sm">
                  <Link href={link} rel="noopener noreferrer">
                    Voir la contribution <i>{email?.contributionId}</i>
                  </Link>
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
                <Text>{email.userResponse.replaceAll("<br/>", " ")}</Text>
              </div>
            </Col>
          );
        })}
    </>
  );
};

export default LastMailsSentItem;
