import { Badge, BadgeGroup, Link, Text, Title } from "@dataesr/dsfr-plus";
import collectionNameMapping, { SentEmail } from "../utils";
import { getContributionLink } from "../../../utils/contribution-links";
import MarkdownRenderer from "../../../components/markdown-renderer";

interface LastMailsSentProps {
  data: {
    emails: SentEmail[];
  };
}

const SCANR_COLLECTIONS = [
  "Changement de nom",
  "Lier des publications",
  "Contribution par objets",
];

const LastMailsSentItem: React.FC<LastMailsSentProps> = ({ data }) => (
  <>
    {data.emails.map((mail) => {
      const link = getContributionLink(
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
        <div className="fr-card fr-card--no-icon fr-enlarge-link fr-mb-3w" key={mail._id}>
          <div className="fr-card__body">
            <div className="fr-card__content">
              <div className="fr-card__start">
                <BadgeGroup>
                  <Badge size="sm" color="green-menthe">
                    {label}
                  </Badge>
                  {SCANR_COLLECTIONS.includes(label) && (
                    <Badge size="sm" color="blue-ecume">
                      scanR
                    </Badge>
                  )}
                  {label === "Demande de bso local" && (
                    <Badge size="sm" color="blue-ecume">
                      BSO
                    </Badge>
                  )}
                  {mail.fromApplication && (
                    <Badge size="sm" color="blue-ecume">
                      {mail.fromApplication}
                    </Badge>
                  )}
                </BadgeGroup>
              </div>
              <Title as="h2" className="fr-card__title">
                <Link href={link}>
                  Réponse de {mail.selectedProfile} à {mail.name}
                </Link>
              </Title>
              <div className="fr-card__desc">
                <Text size="sm" className="fr-text-mention--grey fr-mb-1w">
                  {mail.to}
                </Text>
                <MarkdownRenderer content={mail.userResponse} />
              </div>
              <div className="fr-card__end">
                <Text className="fr-card__detail fr-icon-calendar-line">
                  Envoyé le {formattedDate} à {formattedTime}
                </Text>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </>
);

export default LastMailsSentItem;
