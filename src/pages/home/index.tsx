import { Container } from "@dataesr/dsfr-plus";
import ContributionsGraphByYear from "../../components/graphs/contributions-by-year";
import ContributionsGraphByName from "../../components/graphs/contributions-by-name";

const Home = () => {
  return (
    <Container className="fr-mt-10v">
      <h1>Bienvenue sur le Guichet numérique du DIST</h1>
      <h1>Bientôt des gaphiques</h1>
      <ContributionsGraphByYear />
      <ContributionsGraphByName />
    </Container>
  );
};

export default Home;
