import React from "react";
import {
  Col,
  Container,
  Row,
  Text,
  Tabs,
  Tab,
  Notice,
  Link,
} from "@dataesr/dsfr-plus";
import "./styles.scss";
import MarkdownRenderer from "../../../utils/markdownRenderer";
import type { EmailItem } from "../../../types";

interface LastMailsReceivedProps {
  data: {
    emails: EmailItem[] | { [key: string]: EmailItem[] };
  };
}

const EmailContent: React.FC<{ content: string }> = ({ content }) => (
  <Text size="sm">
    <MarkdownRenderer content={content} />
  </Text>
);

const FormattedDate: React.FC<{ date: string }> = ({ date }) => {
  const sentDate = new Date(date);
  const formattedDate = sentDate.toLocaleDateString("fr-FR");
  const formattedTime = sentDate.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Text size="sm">
      <i>
        Reçu le {formattedDate} à {formattedTime}
      </i>
    </Text>
  );
};

const EmailHeader: React.FC<{ email: EmailItem; showSubject?: boolean }> = ({
  email,
  showSubject = false,
}) => (
  <Row>
    <Col md="10" xs="12" lg="10">
      <Text className="fr-mb-0">
        Envoyé par{" "}
        <strong>
          <i>{email.from[0].name}</i>
        </strong>
      </Text>
      <Text className="fr-mb-1">
        Adresse mail{" "}
        <strong>
          <i>{email.from[0].address}</i>
        </strong>
      </Text>
      {showSubject && (
        <Text className="fr-mb-1">
          Objet{" "}
          <strong>
            <i>{email.subject}</i>
          </strong>
        </Text>
      )}
    </Col>
    <Col>
      <FormattedDate date={email.date} />
    </Col>
  </Row>
);


const EmailItem: React.FC<{ email: EmailItem; showSubject?: boolean }> = ({
  email,
  showSubject,
}) => {
  return (
    <Row gutters key={email._id}>
      <Col lg="12" md="10" sm="12" className="fr-mb-1w fr-mt-2w">
        <Link href={email.href} className="fr-footer__top-link">
          <EmailHeader email={email} showSubject={showSubject} />
          <Text className="received-mail">
            <EmailContent content={email.extractedText} />
          </Text>
        </Link>
      </Col>
    </Row>
  );
};

const LastMailsReceivedItem: React.FC<LastMailsReceivedProps> = ({ data }) => {
  const emails = Array.isArray(data.emails)
    ? data.emails.flat()
    : Object.values(data.emails).flat();

  const isTrackedEmail = (email) =>
    email.subject.includes(" à votre contribution, référence") ||
    email.subject.includes("déclinaison locale, référence");
  const trackedEmails = emails
    .filter(isTrackedEmail)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const untrackedEmails = emails
    .filter((email) => !isTrackedEmail(email))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Container fluid>
      <Tabs>
        <Tab label="Mails Suivis">
          {trackedEmails.length > 0 ? (
            trackedEmails.map((email) => (
              <EmailItem key={email._id} email={email} />
            ))
          ) : (
            <Notice type="info" closeMode="disallow" className="fr-mb-2w">
              Aucun email suivi n'a été reçu.
            </Notice>
          )}
        </Tab>
        <Tab label="Mails Non Suivis">
          <Notice type="info" closeMode="disallow" className="fr-mb-2w">
            Les mails non-suivis correspondent aux mails envoyés spontanément
            par un utilisateur. Ils ne sont pas en réponse à une contribution.
            Pour retrouver les contributions d'un utilisateur, rendez vous dans
            la page accueil et renseignez son nom dans la barre de recherche.
          </Notice>

          {untrackedEmails.length > 0 ? (
            untrackedEmails.map((email) => (
              <EmailItem key={email._id} email={email} showSubject={true} />
            ))
          ) : (
            <Notice type="info" closeMode="disallow" className="fr-mb-2w">
              Aucun email non suivi n'a été reçu.
            </Notice>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default LastMailsReceivedItem;
