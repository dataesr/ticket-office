import React, { useState } from "react";
import { Badge, Col, Row, Text, Notice, Title } from "@dataesr/dsfr-plus";
import ContributorInfo from "./contributor-info";
import StaffActions from "./staff-action";
import { Contribution } from "../../types";
import {
  BadgeColor,
  BadgeStatus,
  StatusLabel,
  TypeLabel,
  typeIcon,
} from "./utils";
import "./styles.scss";
import { FaCopy } from "react-icons/fa";

interface ContributionItemProps {
  data: Contribution & { type: string };
  highlightedQuery: string;
  refetch: () => void;
  allTags: string[];
}
const ContributionItem: React.FC<ContributionItemProps> = ({
  data,
  highlightedQuery,
  refetch,
  allTags,
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

  return (
    <>
      <Row>
        {data?.tags?.length > 0 && (
          <Badge size="sm" color="green-menthe" className="fr-mr-1w fr-mb-1w">
            {data.tags.join(", ")}
          </Badge>
        )}
        {data?.status && (
          <Badge
            size="sm"
            color={BadgeStatus({ status: data?.status })}
            className="fr-mr-1w fr-mb-1w"
          >
            {StatusLabel({ status: data?.status })}
          </Badge>
        )}
        {data?.responseFrom && (
          <Badge size="sm" color="blue-ecume" className="fr-mr-1w fr-mb-1w">
            {`Réponse envoyée par ${data.responseFrom}`}
          </Badge>
        )}
        {data?.comment && data?.team?.length > 0 && (
          <Badge size="sm" color="green-emeraude" className="fr-mr-1w fr-mb-1w">
            {`Commenté par ${data.team[0]}`}
          </Badge>
        )}
        {data?.type && (
          <Badge
            size="sm"
            color={BadgeColor({ type: data.type })}
            className="fr-mr-1w fr-mb-1w"
            icon={typeIcon({ icon: data.type })}
          >
            {TypeLabel({ type: data.type })}
          </Badge>
        )}
      </Row>
      <Row>
        <Col>
          <Title look="h5">
            {data?.name} ({data?._id})
            <button
              className={`copy-button ${
                copiedId === data?._id ? "copied" : ""
              }`}
              onClick={() => copyToClipboard(data?._id)}
            >
              {copiedId === data?._id && (
                <span className="copied-text">Copié</span>
              )}
              <FaCopy size={14} color="#2196f3" className="copy-icon" />
            </button>
          </Title>
          {!data?.mailSent && (
            <Notice type="info" closeMode="disallow" className="fr-mb-2w">
              Aucune réponse apportée à ce message pour l'instant
            </Notice>
          )}
        </Col>
        <Text size="sm">
          <i className="date">
            Reçu le {new Date(data?.created_at)?.toLocaleDateString()}
          </i>
        </Text>
      </Row>
      <Col>
        <ContributorInfo
          data={data}
          highlightedQuery={highlightedQuery}
          refetch={refetch}
          allTags={allTags}
        />
        <StaffActions refetch={refetch} data={data} />
      </Col>
    </>
  );
};

export default ContributionItem;
