import { useState } from "react";
import {
  Col,
  Link,
  Notice,
  Row,
  Tab,
  Tabs,
  Text,
  Title,
} from "@dataesr/dsfr-plus";
import MarkdownRenderer from "../../../components/markdown-renderer";
import ResultsBar from "../../../components/pagination/results-bar";
import BottomPaginationButtons from "../../../components/pagination/bottom-buttons";
import type { EmailItem } from "../../../types";
import { getContributionLink } from "../../../utils/contribution-links";

const PAGE_SIZE = 10;

interface LastMailsReceivedProps {
  data: {
    emails: EmailItem[] | { [key: string]: EmailItem[] };
  };
}

const getContributionPath = (email: EmailItem) => {
  if (!email.referenceId || !email.collectionName) return "";

  const link = getContributionLink(
    email.collectionName,
    email.fromApplication ?? undefined,
    email.referenceId
  );
  return link.startsWith("/") ? link : "";
};

const EmailCard: React.FC<{ email: EmailItem; showSubject?: boolean }> = ({
  email,
  showSubject = false,
}) => {
  const receivedDate = new Date(email.date);
  const formattedDate = receivedDate.toLocaleDateString("fr-FR");
  const formattedTime = receivedDate.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const sender = email.from?.[0];
  const images = email.images ? Object.values(email.images) : [];

  const title = `Envoyé par ${sender?.name || "Expéditeur inconnu"}`;
  const contributionPath = getContributionPath(email);

  return (
    <div className="fr-card fr-card--no-icon fr-enlarge-link fr-mb-3w">
      <div className="fr-card__body">
        <div className="fr-card__content">
          <Title as="h2" className="fr-card__title">
            {contributionPath ? (
              <Link href={contributionPath}>{title}</Link>
            ) : (
              title
            )}
          </Title>
          <div className="fr-card__desc">
            {sender?.address && (
              <Text size="sm" className="fr-text-mention--grey fr-mb-1w">
                {sender.address}
              </Text>
            )}
            {showSubject && (
              <Text size="sm" className="fr-mb-1w">
                Objet : <strong>{email.subject}</strong>
              </Text>
            )}
            <MarkdownRenderer content={email.extractedText} clean />
            {images.length > 0 && (
              <Row gutters>
                {images.map((image, index) => (
                  <Col xs={12} md={4} key={index}>
                    <img
                      className="fr-responsive-img"
                      src={`data:${image.contentType};base64,${image.base64}`}
                      alt={`Pièce jointe ${index + 1}`}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </div>
          <div className="fr-card__end">
            <Text className="fr-card__detail fr-icon-calendar-line">
              Reçu le {formattedDate} à {formattedTime}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

const LastMailsReceivedItem: React.FC<LastMailsReceivedProps> = ({ data }) => {
  const [trackedPage, setTrackedPage] = useState(1);
  const [untrackedPage, setUntrackedPage] = useState(1);

  const emails = Array.isArray(data.emails)
    ? data.emails.flat()
    : Object.values(data.emails).flat();

  const isTrackedEmail = (email: EmailItem) =>
    email.subject.includes(" à votre contribution, référence") ||
    email.subject.includes("déclinaison locale, référence");

  const trackedEmails = emails
    .filter(isTrackedEmail)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const untrackedEmails = emails
    .filter((email) => !isTrackedEmail(email))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // On ne rend qu'une page d'emails à la fois : chaque email peut embarquer des
  // images en base64, donc tout afficher d'un coup est lourd. Une pagination
  // indépendante par onglet borne le nombre d'éléments (et d'images) rendus.
  const trackedMaxPage = Math.max(
    1,
    Math.ceil(trackedEmails.length / PAGE_SIZE)
  );
  const untrackedMaxPage = Math.max(
    1,
    Math.ceil(untrackedEmails.length / PAGE_SIZE)
  );
  const safeTrackedPage = Math.min(trackedPage, trackedMaxPage);
  const safeUntrackedPage = Math.min(untrackedPage, untrackedMaxPage);

  const trackedPageEmails = trackedEmails.slice(
    (safeTrackedPage - 1) * PAGE_SIZE,
    safeTrackedPage * PAGE_SIZE
  );
  const untrackedPageEmails = untrackedEmails.slice(
    (safeUntrackedPage - 1) * PAGE_SIZE,
    safeUntrackedPage * PAGE_SIZE
  );

  return (
    <Tabs>
      <Tab label="Mails Suivis">
        {trackedEmails.length > 0 ? (
          <>
            <ResultsBar
              meta={{ total: trackedEmails.length }}
              page={safeTrackedPage}
              maxPage={trackedMaxPage}
              setPage={setTrackedPage}
              pageSize={PAGE_SIZE}
            />
            {trackedPageEmails.map((email) => (
              <EmailCard key={email._id} email={email} />
            ))}
            <Row horizontalAlign="right">
              <BottomPaginationButtons
                page={safeTrackedPage}
                maxPage={trackedMaxPage}
                setPage={setTrackedPage}
              />
            </Row>
          </>
        ) : (
          <Notice type="info" closeMode="disallow" className="fr-mb-2w">
            Aucun email suivi n'a été reçu.
          </Notice>
        )}
      </Tab>
      <Tab label="Mails Non Suivis">
        <Notice type="info" closeMode="disallow" className="fr-mb-2w">
          Les mails non-suivis correspondent aux mails envoyés spontanément par
          un utilisateur. Ils ne sont pas en réponse à une contribution. Pour
          retrouver les contributions d'un utilisateur, rendez vous dans la page
          accueil et renseignez son nom dans la barre de recherche.
        </Notice>

        {untrackedEmails.length > 0 ? (
          <>
            <ResultsBar
              meta={{ total: untrackedEmails.length }}
              page={safeUntrackedPage}
              maxPage={untrackedMaxPage}
              setPage={setUntrackedPage}
              pageSize={PAGE_SIZE}
            />
            {untrackedPageEmails.map((email) => (
              <EmailCard key={email._id} email={email} showSubject={true} />
            ))}
            <Row horizontalAlign="right">
              <BottomPaginationButtons
                page={safeUntrackedPage}
                maxPage={untrackedMaxPage}
                setPage={setUntrackedPage}
              />
            </Row>
          </>
        ) : (
          <Notice type="info" closeMode="disallow" className="fr-mb-2w">
            Aucun email non suivi n'a été reçu.
          </Notice>
        )}
      </Tab>
    </Tabs>
  );
};

export default LastMailsReceivedItem;
