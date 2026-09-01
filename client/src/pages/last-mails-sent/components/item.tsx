import "./styles.scss";
import Badge from "../../../components/badge";
import collectionNameMapping, { generateLink } from "../utils";
import MarkdownRenderer from "../../../utils/markdownRenderer";

interface Email {
  collectionName: string;
  fromApplication?: string;
  contributionId: string;
  sentAt: string;
  selectedProfile: string;
  name: string;
  to: string;
  userResponse: string;
}

interface LastMailsSentProps {
  data: {
    emails: Email[];
  };
}

const SCANR_COLLECTIONS = [
  "Changement de nom",
  "Lier des publications",
  "Contribution par objets",
];

const LastMailsSentItem: React.FC<LastMailsSentProps> = ({ data }) => (
  <div className="mail-list">
    {data.emails.map((mail, index) => {
      const link = generateLink(
        mail.collectionName,
        mail.fromApplication,
        mail.contributionId
      );
      const sentDate = new Date(mail.sentAt);
      const formattedDate = sentDate.toLocaleDateString("fr-FR");
      const formattedTime = sentDate.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const label =
        collectionNameMapping[mail.collectionName] || mail.collectionName;

      return (
        <a
          className="mail-card"
          href={link}
          rel="noopener noreferrer"
          key={mail.contributionId || index}
        >
          <div className="mail-card__header">
            <ul className="fr-badges-group fr-mb-1w">
              <li>
                <Badge color="green-menthe">{label}</Badge>
              </li>
              {SCANR_COLLECTIONS.includes(label) && (
                <li>
                  <Badge color="blue-ecume">scanR</Badge>
                </li>
              )}
              {label === "Demande de bso local" && (
                <li>
                  <Badge color="blue-ecume">BSO</Badge>
                </li>
              )}
              {mail.fromApplication && (
                <li>
                  <Badge color="blue-ecume">{mail.fromApplication}</Badge>
                </li>
              )}
            </ul>

            <div className="mail-card__header-row">
              <p className="fr-text--sm fr-mb-0">
                Réponse de <strong>{mail.selectedProfile}</strong> à{" "}
                <strong>{mail.name}</strong>
                <span className="fr-text-mention--grey"> ({mail.to})</span>
              </p>
              <p className="fr-text--sm fr-text-mention--grey fr-mb-0 mail-card__date">
                Envoyé le {formattedDate} à {formattedTime}
              </p>
            </div>
          </div>

          <div className="mail-card__body fr-text--sm">
            <MarkdownRenderer content={mail.userResponse} />
          </div>
        </a>
      );
    })}
  </div>
);

export default LastMailsSentItem;
