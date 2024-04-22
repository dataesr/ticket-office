import { Row, Text } from "@dataesr/dsfr-plus";
import { Contribution } from "../../types/contribution";

const MessagePreview = ({
  data,
  renderMessage,
  showDetails,
}: {
  data: Contribution;
  renderMessage: () => JSX.Element;
  showDetails: boolean;
}) => {
  return (
    <Row className="contributorSide">
      <Text size="sm">
        <div className="message-info">
          <div className="info-group">
            <div className="info-item">
              {data.id && (
                <div
                  className={
                    data.type === "structure"
                      ? "fr-icon-building-line"
                      : "fr-icon-user-line"
                  }
                >
                  ID de l'objet concerné : {data.id}
                </div>
              )}
            </div>
            <div className="info-item">
              <div className="name">
                {data.name ? `Nom: ${data.name}` : "Nom non renseigné"}
              </div>
              {data.email && <div>Email: {data.email}</div>}
            </div>
            <div className="info-item">
              {data.organisation && (
                <div>Organisation: {data.organisation}</div>
              )}
              {data.fonction && <div>Fonction: {data.fonction}</div>}
            </div>
            <div className="info-item">
              Reçu le {new Date(data.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
        Message: {showDetails ? data.message : renderMessage()}
      </Text>
    </Row>
  );
};

export default MessagePreview;
