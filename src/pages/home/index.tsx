import { Container } from "@dataesr/dsfr-plus";

const Home = () => {
  return (
    <Container className="fr-mt-10v">
      {console.log(VITE_SCANR_API_AUTHORIZATION)}
      <h1>Bienvenue sur scanR Contact v2 !</h1>
      <p>Contenu de la page d'accueil...</p>
    </Container>
  );
};

export default Home;
