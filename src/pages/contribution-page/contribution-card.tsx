import { useState } from "react";
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

const ContributionItem = ({ data }: { data: any }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };

  const renderMessage = () => {
    const messageLines = data.message.split("\n");
    if (messageLines.length <= 4) {
      return data.message;
    } else {
      return messageLines.slice(8, 4).join("\n");
    }
  };
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
              {data?.tags?.join(", ")}
            </Badge>
          )}
          <Badge
            size="sm"
            color="purple-glycine"
            className="fr-mr-1w fr-mb-1w status"
          >
            {data.status}
          </Badge>
        </Col>
        <i className="date">
          Reçu le {new Date(data.created_at).toLocaleDateString()}
        </i>
      </Row>
      <Row>
        <Col>
          <Text bold className="name">
            {data.name}
          </Text>
          <i className="message">
            {data.message.slice(0, 130)}
            {data.message.length > 70 ? "..." : ""}
          </i>
        </Col>
      </Row>
    </Container>
  );

  return (
    <AccordionGroup>
      <Accordion title={renderAccordion}>
        {!data.comment && (
          <Notice type="info" closeMode={"disallow"} className="fr-mb-2w">
            Aucune réponse apportée à ce message pour l'instant
          </Notice>
        )}
        <ContributorInfo
          data={data}
          renderMessage={renderMessage}
          showDetails={undefined}
        />
        <StaffActions
          data={data}
          showReplyForm={showReplyForm}
          toggleReplyForm={toggleReplyForm}
        />
      </Accordion>
    </AccordionGroup>
  );
};

export default ContributionItem;
