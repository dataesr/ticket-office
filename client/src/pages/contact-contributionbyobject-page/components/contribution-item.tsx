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
    <>
      <Row className="fr-mt-3w">
        {data?.tags?.length > 0 && (
          <Badge size="sm" color="green-menthe" className="fr-mr-1w fr-mb-1w">
            {data.tags.join(", ")}
          </Badge>
        )}
        {data?.status && (
          <Badge
            size="sm"
            color={BadgeStatus({ status: data.status })}
            className="fr-mr-1w fr-mb-1w"
          >
            {StatusLabel({ status: data.status })}
          </Badge>
        )}
        {firstResponse?.team && (
          <Badge size="sm" color="blue-ecume" className="fr-mr-1w fr-mb-1w">
            {`Réponse envoyée par ${firstResponse.team}`}
          </Badge>
        )}
        {data?.comment && data?.team?.length > 0 && (
          <Badge size="sm" color="green-emeraude" className="fr-mr-1w fr-mb-1w">
            {`Commenté par ${data.team[0]}`}
          </Badge>
        )}
        {data?.objectType && (
          <Badge
            size="sm"
            color={BadgeColor({ type: data.objectType })}
            className="fr-mr-1w fr-mb-1w"
            icon={typeIcon({ icon: data.objectType })}
          >
            {TypeLabel({ type: data.objectType })}
          </Badge>
        )}
      </Row>

      <Row>
        <Col>
          <Title look="h5">
            {data?.name || ""} ({data?.id || ""})
            <button
              className={`copy-button ${copiedId === data?.id ? "copied" : ""}`}
              onClick={copyToClipboard}
              disabled={!data?.id}
            >
              {copiedId === data?.id && (
                <span className="copied-text">Copié</span>
              )}
              <FaCopy size={14} color="#2196f3" className="copy-icon" />
            </button>
          </Title>
          {!firstResponse && (
            <Notice type="info" closeMode="disallow" className="fr-mb-2w">
              Aucune réponse apportée à ce message pour l'instant
            </Notice>
          )}
        </Col>
        {createdDate && (
          <Text size="sm">
            <i className="date">Reçu le {createdDate}</i>
          </Text>
        )}
      </Row>
      <Col>
        <MessagePreview
          data={data}
          allTags={allTags}
          refetch={refetch}
          highlightedQuery={highlightedQuery}
        />
        <StaffActions url={url} refetch={refetch} data={data} />
      </Col>
    </>
  );
};

export default ContributionItem;
