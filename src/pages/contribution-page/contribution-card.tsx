import {
  Accordion,
  AccordionGroup,
  Badge,
  Col,
  Container,
  Notice,
  Row,
  Text,
} from "@dataesr/dsfr-plus";
import "./styles.scss";
import ContributorInfo from "./contributor-info";
import StaffActions from "./staff-action";
import { Contribution } from "../../types";
import HighlightedMessage from "../../components/highlighted-message";
import { BadgeColor } from "./utils";

const ContributionItem = ({
  data,
  highlightedQuery,
  refetch,
}: {
  data: Contribution;
  highlightedQuery: string;
  refetch: any;
}) => {
  const renderAccordion = () => (
    <Container fluid className="accordion">
      <Row className="top-accordion">
        <Col>
          {data.tags && (
            <Badge
              size="sm"
              color="purple-glycine"
              className="fr-mr-1w fr-mb-1w tag"
            >
              {data.tags.join(", ")}
            </Badge>
          )}
          <Badge
            size="sm"
            color="purple-glycine"
            className="fr-mr-1w fr-mb-1w status"
          >
            {data.status}
          </Badge>
          {data.responseFrom && (
            <Badge
              size="sm"
              color="blue-ecume"
              className="fr-mr-1w fr-mb-1w status"
            >
              {`Réponse envoyé par ${data.responseFrom}`}
            </Badge>
          )}
          {data.comment && data?.team && data.team.length > 0 && (
            <Badge
              size="sm"
              color="green-emeraude"
              className="fr-mr-1w fr-mb-1w status"
            >
              {`commenté par ${data.team[0]}`}
            </Badge>
          )}
          {data.type && (
            <Badge
              size="sm"
              color={BadgeColor({ type: data.type })}
              className="fr-mr-1w fr-mb-1w status"
            >
              {data.type}
            </Badge>
          )}
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
            {data.name}
          </Text>
          <Text size="sm">
            <i className="message">
              <HighlightedMessage
                message={
                  data.message.length > 70
                    ? `${data.message.slice(0, 300)}...`
                    : data.message
                }
                highlightedQuery={highlightedQuery}
              />
            </i>
          </Text>
        </Col>
      </Row>
    </Container>
  );

  return (
    <AccordionGroup>
      <Accordion title={renderAccordion}>
        {!data.comment && (
          <Notice type="info" closeMode={"disallow"} className="fr-mb-1w">
            Aucune réponse apportée à ce message pour l'instant
          </Notice>
        )}
        <ContributorInfo
          data={data}
          highlightedQuery={highlightedQuery}
          refetch={refetch}
        />
        <StaffActions refetch={refetch} data={data} />
      </Accordion>
    </AccordionGroup>
  );
};

export default ContributionItem;
