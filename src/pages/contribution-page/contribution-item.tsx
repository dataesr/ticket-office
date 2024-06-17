import React from "react";
import { Badge, Col, Row, Text, Notice, Title } from "@dataesr/dsfr-plus";
import ContributorInfo from "./contributor-info";
import StaffActions from "./staff-action";
import { Contribution } from "../../types";
import { BadgeColor } from "./utils";
import "./styles.scss";

interface ContributionItemProps {
  data: Contribution;
  highlightedQuery: string;
  refetch: () => void;
}
const ContributionItem: React.FC<ContributionItemProps> = ({
  data,
  highlightedQuery,
  refetch,
}) => {
  return (
    <>
      <div>
        {data?.tags?.length > 0 && (
          <Badge size="sm" color="purple-glycine" className="fr-mr-1w fr-mb-1w">
            {data.tags.join(", ")}
          </Badge>
        )}
        <Badge size="sm" color="purple-glycine" className="fr-mr-1w fr-mb-1w">
          {data?.status}
        </Badge>
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
          >
            {data.type}
          </Badge>
        )}
      </div>
      <Row>
        <Col>
          <Title look="h5">{data?.name}</Title>
          {!data?.comment && (
            <Notice type="info" closeMode="disallow" className="fr-mb-2w">
              Aucune réponse apportée à ce message pour l'instant
            </Notice>
          )}
        </Col>
        <Text size="sm" bold>
          <i>Reçu le {new Date(data?.created_at).toLocaleDateString()}</i>
        </Text>
      </Row>
      <Col>
        <ContributorInfo
          data={data}
          highlightedQuery={highlightedQuery}
          refetch={refetch}
        />
        <StaffActions refetch={refetch} data={data} />
      </Col>
    </>
  );
};

export default ContributionItem;
