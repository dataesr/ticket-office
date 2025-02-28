import { Badge, Col, Container, Link, Row, Text } from "@dataesr/dsfr-plus";
import "./styles.scss";
import collectionNameMapping, { generateLink } from "./generate-links";
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

const LastMailsSentItem: React.FC<LastMailsSentProps> = ({ data }) => {
  return (
    <Container fluid>
      {data.emails
        .slice()
        .sort(
          (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
        )
        .map((lastMailSent, index) => {
          const link = generateLink(
            lastMailSent.collectionName,
            lastMailSent.fromApplication,
            lastMailSent.contributionId
          );

          const sentDate = new Date(lastMailSent.sentAt);
          const formattedDate = sentDate.toLocaleDateString("fr-FR");
          const formattedTime = sentDate.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          });

          const showScanrBadge = [
            "Changement de nom",
            "Lier des publications",
            "Contribution par objets",
          ].includes(collectionNameMapping[lastMailSent.collectionName]);

          return (
            <Link href={link} rel="noopener noreferrer" key={index}>
              <Row gutters className="email-row">
                <Col lg="12" md="10" sm="12" className="fr-mb-1w fr-mt-2w">
                  <div className="badges">
                    <Badge
                      size="sm"
                      color="green-menthe"
                      className="fr-mr-1w fr-mb-1w"
                    >
                      {collectionNameMapping[lastMailSent.collectionName]}
                    </Badge>
                    {showScanrBadge && (
                      <Badge
                        size="sm"
                        color="blue-ecume"
                        className="fr-mr-1w fr-mb-1w"
                      >
                        Scanr
                      </Badge>
                    )}
                    {lastMailSent.fromApplication && (
                      <Badge
                        size="sm"
                        color="blue-ecume"
                        className="fr-mr-1w fr-mb-1w"
                      >
                        {lastMailSent.fromApplication}
                      </Badge>
                    )}
                  </div>
                  <Row>
                    <Col md="10" xs="12" lg="10">
                      <Text>
                        Réponse de{" "}
                        <strong>
                          <i>{lastMailSent.selectedProfile}</i>
                        </strong>{" "}
                        à{" "}
                        <strong>
                          <i>
                            {lastMailSent?.name} ({lastMailSent?.to})
                          </i>
                        </strong>
                      </Text>
                    </Col>
                    <Col>
                      <Text size="sm">
                        <i>
                          Envoyé le {formattedDate} à {formattedTime}
                        </i>
                      </Text>
                    </Col>
                  </Row>
                  <Text className="sent-mail">
                    <MarkdownRenderer content={lastMailSent.userResponse} />
                  </Text>
                </Col>
              </Row>
            </Link>
          );
        })}
    </Container>
  );
};

export default LastMailsSentItem;
