import { Col, Container, Row, Text, Title } from "@dataesr/dsfr-plus";
import { ClipLoader } from "react-spinners";
import LastMailsReceivedItem from "./components/item";
import useReceivedEmails from "../../api/contribution-api/getReceivedMails";

const LastMailsReceived: React.FC = () => {
  const { data, isLoading, isError } = useReceivedEmails();

  if (isLoading) {
    return (
      <div className="loading-container">
        <ClipLoader color="#123abc" size={50} />
      </div>
    );
  }

  if (isError)
    return (
      <Container className="fr-my-5w">
        <Text>Erreur lors du chargement des emails reçus.</Text>
      </Container>
    );

  return (
    <Container className="fr-my-5w">
      <Title as="h1">Derniers mails reçus</Title>
      <Row gutters className="fr-mb-3w"></Row>
      <Col md="6" xs="12" lg="12">
        <LastMailsReceivedItem
          data={{
            emails: data,
          }}
        />
      </Col>
    </Container>
  );
};

export default LastMailsReceived;
