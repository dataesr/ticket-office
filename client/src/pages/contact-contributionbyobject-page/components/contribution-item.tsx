import { useState } from "react";
import { Badge, Col, Row, Text, Notice, Title } from "@dataesr/dsfr-plus";
import StaffActions from "./staff-action";
import {
  BadgeColor,
  BadgeStatus,
  StatusLabel,
  TypeLabel,
  typeIcon,
} from "../../../utils";
import { FaCopy } from "react-icons/fa";
import "./styles.scss";
import MessagePreview from "./message-preview";
import { ContributionItemProps } from "../../../types";

const ContributionItem: React.FC<ContributionItemProps> = ({
  data,
  highlightedQuery,
  refetch,
  allTags,
  url,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = () => {
    if (!data?.id) return;

    navigator.clipboard.writeText(data.id).then(() => {
      setCopiedId(data.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const firstThread = data?.threads?.[0];
  const firstResponse = firstThread?.responses?.[0];
  const createdDate = data?.created_at
    ? new Date(data.created_at).toLocaleDateString()
    : "";

  return (
    <div className="contribution-item-container">
      {/* Badges regroupés avec flexbox pour mieux s'adapter */}
      <Row className="fr-mt-3w badge-container">
        <div className="badge-wrapper">
          {data?.tags?.length > 0 && (
            <Badge size="sm" color="green-menthe" className="badge-item">
              {data.tags.join(", ")}
            </Badge>
          )}
          {data?.status && (
            <Badge
              size="sm"
              color={BadgeStatus({ status: data.status })}
              className="badge-item"
            >
              {StatusLabel({ status: data.status })}
            </Badge>
          )}
          {firstResponse?.team && (
            <Badge size="sm" color="blue-ecume" className="badge-item">
              {`Réponse: ${firstResponse.team}`}
            </Badge>
          )}
          {data?.comment && data?.team?.length > 0 && (
            <Badge size="sm" color="green-emeraude" className="badge-item">
              {`Commenté par ${data.team[0]}`}
            </Badge>
          )}
          {data?.objectType && (
            <Badge
              size="sm"
              color={BadgeColor({ type: data.objectType })}
              className="badge-item"
              icon={typeIcon({ icon: data.objectType })}
            >
              {TypeLabel({ type: data.objectType })}
            </Badge>
          )}
        </div>
      </Row>

      {/* En-tête avec titre et date de création */}
      <Row className="title-container">
        <Col xs="12" md="8">
          <div className="title-wrapper">
            <Title look="h5" className="contribution-title">
              {data?.name || ""}
              <span className="id-container">
                ({data?.id || ""})
                <button
                  className={`copy-button ${
                    copiedId === data?.id ? "copied" : ""
                  }`}
                  onClick={copyToClipboard}
                  aria-label="Copier l'identifiant"
                  disabled={!data?.id}
                >
                  {copiedId === data?.id && (
                    <span className="copied-text">Copié</span>
                  )}
                  <FaCopy size={14} color="#2196f3" className="copy-icon" />
                </button>
              </span>
            </Title>
          </div>

          {!firstResponse && (
            <Notice type="info" closeMode="disallow" className="fr-mb-2w">
              Aucune réponse apportée à ce message pour l'instant
            </Notice>
          )}
        </Col>
        <Col xs="12" md="4" className="date-container">
          {createdDate && (
            <Text size="sm" className="date-text">
              <i className="date">Reçu le {createdDate}</i>
            </Text>
          )}
        </Col>
      </Row>
      <Row>
        <Col xs="12">
          <MessagePreview
            data={data}
            allTags={allTags}
            refetch={refetch}
            highlightedQuery={highlightedQuery}
          />
          <StaffActions url={url} refetch={refetch} data={data} />
        </Col>
      </Row>
    </div>
  );
};

export default ContributionItem;
