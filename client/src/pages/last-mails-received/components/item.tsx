import { useState } from "react";
import { Tabs, Tab, Notice } from "@dataesr/dsfr-plus";
import "./styles.scss";
import MarkdownRenderer from "../../../utils/markdownRenderer";
import TopPaginationButtons from "../../../components/pagination/top-buttons";
import BottomPaginationButtons from "../../../components/pagination/bottom-buttons";
import type { EmailItem } from "../../../types";

const PAGE_SIZE = 10;

interface LastMailsReceivedProps {
  data: {
    emails: EmailItem[] | { [key: string]: EmailItem[] };
  };
}

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

  return (
    <a className="mail-card" href={email.href} rel="noopener noreferrer">
      <div className="mail-card__header">
        <div className="mail-card__header-row">
          <div>
            <p className="fr-text--sm fr-mb-0">
              Envoyé par <strong>{sender?.name || "Expéditeur inconnu"}</strong>
            </p>
            {sender?.address && (
              <p className="fr-text--xs fr-text-mention--grey fr-mb-0">
                {sender.address}
              </p>
            )}
            {showSubject && (
              <p className="fr-text--sm fr-mb-0 fr-mt-1v">
                Objet : <strong>{email.subject}</strong>
              </p>
            )}
          </div>
          <p className="fr-text--sm fr-text-mention--grey fr-mb-0 mail-card__date">
            Reçu le {formattedDate} à {formattedTime}
          </p>
        </div>
      </div>

      <div className="mail-card__body fr-text--sm">
        <MarkdownRenderer content={email.extractedText} clean />
        {images.length > 0 && (
          <div className="mail-card__images">
            {images.map((image, index) => (
              <img
                key={index}
                src={`data:${image.contentType};base64,${image.base64}`}
                alt={`Pièce jointe ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </a>
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
            <TopPaginationButtons
              meta={{ total: trackedEmails.length }}
              page={safeTrackedPage}
              maxPage={trackedMaxPage}
              setPage={setTrackedPage}
              pageSize={PAGE_SIZE}
            />
            <div className="mail-list">
              {trackedPageEmails.map((email) => (
                <EmailCard key={email._id} email={email} />
              ))}
            </div>
            <BottomPaginationButtons
              page={safeTrackedPage}
              maxPage={trackedMaxPage}
              setPage={setTrackedPage}
            />
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
            <TopPaginationButtons
              meta={{ total: untrackedEmails.length }}
              page={safeUntrackedPage}
              maxPage={untrackedMaxPage}
              setPage={setUntrackedPage}
              pageSize={PAGE_SIZE}
            />
            <div className="mail-list">
              {untrackedPageEmails.map((email) => (
                <EmailCard key={email._id} email={email} showSubject={true} />
              ))}
            </div>
            <BottomPaginationButtons
              page={safeUntrackedPage}
              maxPage={untrackedMaxPage}
              setPage={setUntrackedPage}
            />
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
