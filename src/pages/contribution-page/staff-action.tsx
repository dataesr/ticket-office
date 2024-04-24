import { Col, Text } from "@dataesr/dsfr-plus";
import EmailSender from "../../api/send-mail";
import type { Contribution } from "../../types";

const StaffActions = ({ data }: { data: Contribution }) => {
  return (
    <Col className="staffSide">
      <EmailSender contribution={data} />
      {data.comment && <Text size="sm">Réponse : {data.comment}</Text>}
    </Col>
  );
};

export default StaffActions;
