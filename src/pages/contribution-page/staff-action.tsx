import { Col, Text } from "@dataesr/dsfr-plus";
import EmailSender from "../../api/send-mail";
import type { Contribution } from "../../types";
import { useLocation } from "react-router-dom";

const StaffActions = ({ data }: { data: Contribution }) => {
  const location = useLocation();
  const contributorClassName = location.pathname.includes("contributionpage")
    ? "staffSide"
    : "staffSideContact";
  return (
    <Col className={contributorClassName}>
      <EmailSender contribution={data} />
      {data.comment && <Text size="sm">Réponse : {data.comment}</Text>}
    </Col>
  );
};

export default StaffActions;
