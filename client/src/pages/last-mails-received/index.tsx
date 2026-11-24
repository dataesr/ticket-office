import { Container, Text } from "@dataesr/dsfr-plus";
import Loader from "../../components/loader";
import PageBanner from "../../components/page-banner";
import LastMailsReceivedItem from "./components/item";
import { useReceivedEmails } from "../../api/mails";
import "./components/styles.scss";

const LastMailsReceived: React.FC = () => {
  const { data, isLoading, isError } = useReceivedEmails();

  if (isLoading) {
    return (
      <main id="content">
        <Loader />
      </main>
    );
  }

  if (isError)
    return (
      <Container as="main" id="content" className="fr-my-5w">
        <Text>Erreur lors du chargement des emails reçus.</Text>
      </Container>
    );

  return (
    <main id="content">
      <PageBanner
        title="Derniers mails reçus"
        description="Les mails reçus des utilisateurs, suivis (en réponse à une contribution) ou spontanés."
      />

      <Container className="fr-py-6w">
        <LastMailsReceivedItem data={{ emails: data?.emails ?? [] }} />
      </Container>
    </main>
  );
};

export default LastMailsReceived;
