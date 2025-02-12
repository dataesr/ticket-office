import {
  Col,
  Container,
  Row,
  Text,
  Tabs,
  Tab,
  Notice,
} from "@dataesr/dsfr-plus";
import "./styles.scss";
import { LastMailsReceivedProps } from "../../../types";
import MarkdownRenderer from "../../../utils/markdownRenderer";

const EmailContent = ({ content }) => {
  return (
    <>
      <MarkdownRenderer content={content} />
    </>
  );
};

const LastMailsReceivedItem: React.FC<LastMailsReceivedProps> = ({ data }) => {
  const emails = Array.isArray(data.emails)
    ? data.emails.flat()
    : Object.values(data.emails).flat();

  const trackedEmails = emails.filter((email) =>
    email.subject.includes(" à votre contribution, référence")
  );

  const untrackedEmails = emails.filter(
    (email) => !email.subject.includes(" à votre contribution, référence")
  );

  const sortedTrackedEmails = trackedEmails.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const sortedUntrackedEmails = untrackedEmails.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Container fluid>
      <Tabs>
        <Tab label="Mails Suivis">
          {sortedTrackedEmails.map((lastMailReceived) => {
            const sentDate = new Date(lastMailReceived.date);
            const formattedDate = sentDate.toLocaleDateString("fr-FR");
            const formattedTime = sentDate.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <Row gutters key={lastMailReceived._id}>
                <Col lg="12" md="10" sm="12" className="fr-mb-1w fr-mt-2w">
                  <Row>
                    <Col md="10" xs="12" lg="10">
                      <Text className="fr-mb-0">
                        Envoyé par{" "}
                        <strong>
                          <i>{lastMailReceived.from[0].name}</i>
                        </strong>
                      </Text>
                      <Text className="fr-mb-1">
                        Adresse mail{" "}
                        <strong>
                          <i>{lastMailReceived.from[0].address}</i>
                        </strong>
                      </Text>
                    </Col>
                    <Col>
                      <Text size="sm">
                        <i>
                          Reçu le {formattedDate} à {formattedTime}
                        </i>
                      </Text>
                    </Col>
                  </Row>
                  <Text className="received-mail">
                    <EmailContent content={lastMailReceived.extractedText} />
                  </Text>
                </Col>
              </Row>
            );
          })}
        </Tab>
        <Tab label="Mails Non Suivis">
          <Notice type="info" closeMode="disallow" className="fr-mb-2w">
            Les mails non-suivis correspondent aux mails envoyés spontanément
            par un utilisateur. Ils ne sont pas en réponse à une contribution.
            Pour retrouver les contributions d'un utilisateur, rendez vous dans
            la page accueil et renseignez son nom dans la barre de recherche.
          </Notice>
          {sortedUntrackedEmails.map((lastMailReceived) => {
            const sentDate = new Date(lastMailReceived.date);
            const formattedDate = sentDate.toLocaleDateString("fr-FR");
            const formattedTime = sentDate.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <Row gutters key={lastMailReceived._id}>
                <Col lg="12" md="10" sm="12" className="fr-mb-1w fr-mt-2w">
                  <Row>
                    <Col md="10" xs="12" lg="10">
                      <Text className="fr-mb-0">
                        Envoyé par{" "}
                        <strong>
                          <i>{lastMailReceived.from[0].name}</i>
                        </strong>
                      </Text>
                      <Text className="fr-mb-1">
                        Adresse mail{" "}
                        <strong>
                          <i>{lastMailReceived.from[0].address}</i>
                        </strong>
                      </Text>
                      <Text className="fr-mb-1">
                        Objet{" "}
                        <strong>
                          <i>{lastMailReceived.subject}</i>
                        </strong>
                      </Text>
                    </Col>
                    <Col>
                      <Text size="sm">
                        <i>
                          Reçu le {formattedDate} à {formattedTime}
                        </i>
                      </Text>
                    </Col>
                  </Row>
                  <Text className="received-mail">
                    <EmailContent content={lastMailReceived.extractedText} />
                  </Text>
                </Col>
              </Row>
            );
          })}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default LastMailsReceivedItem;
