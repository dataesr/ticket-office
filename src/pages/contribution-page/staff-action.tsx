import { Col, Row, Text } from "@dataesr/dsfr-plus";
import EmailSender from "../../api/send-mail";
import type { Contribution } from "../../types";
import { useLocation } from "react-router-dom";

const StaffActions = ({ data }: { data: Contribution }) => {
  const location = useLocation();
  const contributorClassName = location.pathname.includes("contributionpage")
    ? "staffSide"
    : "staffSideContact";

  console.log(data);
  return (
    <>
      {data.comment && (
        <Col className={contributorClassName}>
          <Text size="sm">
            Réponse déjà apportée par {data.team[0]} le{" "}
            {new Date(data.modified_at).toLocaleDateString()}
          </Text>
          <br />
          <Text>: {data.comment}</Text>
        </Col>
      )}
      <EmailSender contribution={data} />
    </>
  );
};

export default StaffActions;
