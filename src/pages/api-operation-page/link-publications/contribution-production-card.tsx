import {
  Accordion,
  AccordionGroup,
  Badge,
  Col,
  Container,
  Row,
  Text,
} from "@dataesr/dsfr-plus";
import "./styles.scss";
import { Contribute_Production } from "../../../types";
import ContributorProductionInfo from "./contributor-production-info";
import StaffProductionActions from "./staff-production-action";
import { BadgeStatus, StatusLabel } from "../../contribution-page/utils";
import { useState } from "react";
import { FaCopy } from "react-icons/fa";

const ContributionProductionItem = ({
  data,
  refetch,
  allTags,
}: {
  data: Contribute_Production;
  refetch;
  allTags: string[];
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
  const renderAccordion = () => (
    <Container fluid className="accordion">
      <Row>
        <Col>
          {data?.status && (
            <Badge
              size="sm"
              color={BadgeStatus({ status: data?.status })}
              className="fr-mr-1w fr-mb-1w"
            >
              {StatusLabel({ status: data.status })}
            </Badge>
          )}
          {data.tag && (
            <Badge
              size="sm"
              color="green-menthe"
              className="fr-mr-1w fr-mb-1w status"
            >
              {data.tag}
            </Badge>
          )}
          <Badge
            size="sm"
            color="green-emeraude"
            className="fr-mr-1w fr-mb-1w status"
          >
            {data.productions.length.toString() + " Publications à lier "}
          </Badge>
        </Col>
        <Text size="sm">
          <i className="date">
            Reçu le {new Date(data.created_at).toLocaleDateString()}
          </i>
        </Text>
      </Row>
      <Row>
        <Col>
          <Text size="sm" bold className="name">
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
          </Text>
        </Col>
      </Row>
    </Container>
  );

  return (
    <AccordionGroup>
      <Accordion title={renderAccordion}>
        <ContributorProductionInfo
          data={data}
          refetch={refetch}
          allTags={allTags}
        />
        <StaffProductionActions data={data} refetch={refetch} />
      </Accordion>
    </AccordionGroup>
  );
};

export default ContributionProductionItem;
