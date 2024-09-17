import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";
import ContributionsGraphByYear from "../../components/graphs/contributions-by-year";
import ContributionsGraphByName from "../../components/graphs/contributions-by-name";
import ContributionsGraphByStatus from "../../components/graphs/by-status";
import ContributionsGraphByTags from "../../components/graphs/by-tags";
import ContributionsGraphByDomains from "../../components/graphs/by-domains";
import ContributionsGraphByTypes from "../../components/graphs/by-types";
import AdminTreatmentGraph from "../../components/graphs/treatment-by-admin";
import AdminResponseGraph from "../../components/graphs/response-by-admin";
import ContributionsGraphByProductions from "../../components/graphs/by-missing-productions";
import CommentsGraphByTeamMember from "../../components/graphs/comment-by-team";
import ContributionsGraphByYearAndType from "../../components/graphs/contribution-by-type";
import { useState } from "react";
import { contactUrl, contributionUrl } from "../../config/api";
import ContributionData from "../../api/contribution-api/getData";

const Home = () => {
  const [filter, setFilter] = useState("contributions");
  const url = filter === "object" ? contributionUrl : contactUrl;
  const { data, isLoading, isError } = ContributionData(url);
  const contributions = data as { data: [] };

  return (
    <Container className="fr-mt-10v">
      <Title>Bienvenue sur le Guichet numérique du DISD</Title>
      <Row gutters className="fr-grid-row--center fr-mt-5w">
        <Col md="6">
          <ContributionsGraphByYear
            contributions={contributions}
            isLoading={isLoading}
            isError={isError}
            filter={filter}
            setFilter={setFilter}
          />
        </Col>
        <Col md="6">
          <ContributionsGraphByName
            contributions={contributions}
            isLoading={isLoading}
            isError={isError}
            filter={filter}
            setFilter={setFilter}
          />
        </Col>
      </Row>
      <Row gutters className="fr-grid-row--center fr-mt-5w">
        <Col md="6">
          <AdminTreatmentGraph
            contributions={contributions}
            isLoading={isLoading}
            isError={isError}
            filter={filter}
            setFilter={setFilter}
          />
        </Col>
        <Col md="6">
          <ContributionsGraphByStatus
            contributions={contributions}
            isLoading={isLoading}
            isError={isError}
            filter={filter}
            setFilter={setFilter}
          />
        </Col>
      </Row>
      <Row gutters className="fr-grid-row--center fr-mt-5w">
        <Col md="6">
          <ContributionsGraphByTags
            contributions={contributions}
            isLoading={isLoading}
            isError={isError}
            filter={filter}
            setFilter={setFilter}
          />
        </Col>
        <Col md="6">
          <ContributionsGraphByDomains
            contributions={contributions}
            isLoading={isLoading}
            isError={isError}
            filter={filter}
            setFilter={setFilter}
          />
        </Col>
      </Row>
      <Row gutters className="fr-grid-row--center fr-mt-5w">
        {url === contributionUrl && (
          <Col md="6">
            <ContributionsGraphByTypes
              contributions={contributions}
              isLoading={isLoading}
              isError={isError}
            />
          </Col>
        )}
        <Col md="6">
          <AdminResponseGraph
            contributions={contributions}
            isLoading={isLoading}
            isError={isError}
            filter={filter}
            setFilter={setFilter}
          />
        </Col>
      </Row>
      <Row gutters className="fr-grid-row--center fr-mt-5w">
        <Col md="6">
          <ContributionsGraphByProductions
            contributions={contributions}
            isLoading={isLoading}
            isError={isError}
          />
        </Col>
        <Col md="6">
          <CommentsGraphByTeamMember
            contributions={contributions}
            isLoading={isLoading}
            isError={isError}
            filter={filter}
            setFilter={setFilter}
          />
        </Col>
      </Row>
      <Row gutters className="fr-grid-row--center fr-mt-5w">
        <Col md="6">
          <ContributionsGraphByYearAndType
            contributions={contributions}
            isLoading={isLoading}
            isError={isError}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
