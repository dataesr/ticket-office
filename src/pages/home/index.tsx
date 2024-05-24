import { Col, Container, Row } from "@dataesr/dsfr-plus";
import ContributionsGraphByYear from "../../components/graphs/contributions-by-year";
import ContributionsGraphByName from "../../components/graphs/contributions-by-name";
import AdminResponseGraph from "../../components/graphs/response-by-admin";
import ContributionsGraphByStatus from "../../components/graphs/by-status";
import ContributionsGraphByTags from "../../components/graphs/by-tags";
import ContributionsGraphByDomains from "../../components/graphs/by-domains";
import ContributionsGraphByTypes from "../../components/graphs/by-types";

const Home = () => {
  return (
    <Container className="fr-mt-10v">
      <h1>Bienvenue sur le Guichet numérique du DISD</h1>
      <Row gutters className="fr-grid-row--center fr-mt-5w">
        <Col md="6">
          <ContributionsGraphByYear />
        </Col>
        <Col md="6">
          <ContributionsGraphByName />
        </Col>
      </Row>
      <Row gutters className="fr-grid-row--center fr-mt-5w">
        <Col md="6">
          <AdminResponseGraph />
        </Col>
        <Col md="6">
          <ContributionsGraphByStatus />
        </Col>
      </Row>
      <Row gutters className="fr-grid-row--center fr-mt-5w">
        <Col md="6">
          <ContributionsGraphByTags />
        </Col>
        <Col md="6">
          <ContributionsGraphByDomains />
        </Col>
      </Row>
      <Row gutters className="fr-grid-row--center fr-mt-5w">
        <Col md="6">
          <ContributionsGraphByTypes />
        </Col>
        {/* <Col md="6">
          <ContributionsGraphByDomains />
        </Col> */}
      </Row>
    </Container>
  );
};

export default Home;
