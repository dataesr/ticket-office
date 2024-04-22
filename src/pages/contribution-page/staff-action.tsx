import { Button, Col, Text } from "@dataesr/dsfr-plus";
import EmailSender from "../../api/send-mail";

const StaffActions = ({ data, showReplyForm, toggleReplyForm }) => {
  return (
    <Col className="staffSide">
      {!showReplyForm && (
        <Button
          size="sm"
          className="fr-mt-2w"
          onClick={toggleReplyForm}
          variant="secondary"
        >
          Répondre à ce mail
        </Button>
      )}
      {showReplyForm && <EmailSender contribution={data} />}
      {data.comment && <Text size="sm">Réponse : {data.comment}</Text>}
    </Col>
  );
};

export default StaffActions;
