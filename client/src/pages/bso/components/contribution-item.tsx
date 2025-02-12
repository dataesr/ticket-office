import { useState } from "react";

import { Badge, Col, Row, Text, Title } from "@dataesr/dsfr-plus";
import { BadgeStatus, StatusLabel } from "../../../utils";
import { FaCopy } from "react-icons/fa";
import "./styles.scss";
import { BSOContributionItemProps } from "../types";

const BSOContributionItem: React.FC<BSOContributionItemProps> = ({
  contribution,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(text);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    });
  };

  const firstThread = contribution?.threads?.[0];
  const firstResponse = firstThread?.responses?.[0];

  return (
    <>
      <Row className="fr-mt-3w">
        {contribution?.tags?.length > 0 && (
          <Badge size="sm" color="green-menthe" className="fr-mr-1w fr-mb-1w">
            {contribution.tags.join(", ")}
          </Badge>
        )}
        {contribution?.status && (
          <Badge
            size="sm"
            color={BadgeStatus({ status: contribution?.status })}
            className="fr-mr-1w fr-mb-1w"
          >
            {StatusLabel({ status: contribution?.status })}
          </Badge>
        )}
        {firstResponse?.team && (
          <Badge size="sm" color="blue-ecume" className="fr-mr-1w fr-mb-1w">
            {`Réponse envoyée par ${firstResponse.team}`}
          </Badge>
        )}
        {contribution?.comment && contribution?.team?.length > 0 && (
          <Badge size="sm" color="green-emeraude" className="fr-mr-1w fr-mb-1w">
            {`Commenté par ${contribution.team[0]}`}
          </Badge>
        )}
      </Row>
      <Row>
        <Col>
          <Title look="h5">
            {contribution?.name} ({contribution?.id})
            <button
              className={`copy-button ${
                copiedId === contribution?.id ? "copied" : ""
              }`}
              onClick={() => copyToClipboard(contribution?.id)}
            >
              {copiedId === contribution?.id && (
                <span className="copied-text">Copié</span>
              )}
              <FaCopy size={14} color="#2196f3" className="copy-icon" />
            </button>
          </Title>
        </Col>
        <Text size="sm">
          <i className="date">
            Reçu le {new Date(contribution?.created_at)?.toLocaleDateString()}
          </i>
        </Text>
      </Row>
    </>
  );
};

export default BSOContributionItem;
