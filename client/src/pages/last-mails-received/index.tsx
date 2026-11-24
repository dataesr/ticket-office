import { Container, Text } from "@dataesr/dsfr-plus";
import Loader from "../../components/loader";
import LastMailsReceivedItem from "./components/item";
import { useReceivedEmails } from "../../api/mails";
import "./components/styles.scss";

const LastMailsReceived: React.FC = () => {
  const { data, isLoading, isError } = useReceivedEmails();

  if (isLoading) {
    return <Loader />;
  }

  if (isError)
    return (
      <Container className="fr-my-5w">
        <Text>Erreur lors du chargement des emails reçus.</Text>
      </Container>
    );

  return (
    <main id="content" className="mails-top-page">
      <section className="mails-top-page__banner">
        <div className="fr-container fr-py-8w">
          <h1 className="fr-mb-1w">Derniers mails reçus</h1>
          <p className="fr-mb-0 fr-text--sm">
            Les mails reçus des utilisateurs, suivis (en réponse à une
            contribution) ou spontanés.
          </p>
        </div>
      </section>

      <Container className="fr-py-6w">
        <LastMailsReceivedItem data={{ emails: data?.emails ?? [] }} />
      </Container>
    </main>
  );
};

export default LastMailsReceived;
