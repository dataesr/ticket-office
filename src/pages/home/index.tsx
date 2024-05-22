import { Col, Container, Row } from "@dataesr/dsfr-plus";
import ContributionsGraphByYear from "../../components/graphs/contributions-by-year";
import ContributionsGraphByName from "../../components/graphs/contributions-by-name";

const Home = () => {
  return (
    <Container className="fr-mt-10v">
      <h1>Bienvenue sur le Guichet numérique du DISD</h1>
      <Row gutters className="fr-grid-row--center fr-mt-5w">
        <Col>
          <ContributionsGraphByYear />
        </Col>
      </Row>
      <Row gutters className="fr-grid-row--center fr-mt-5w ">
        <Col>
          <ContributionsGraphByName />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
