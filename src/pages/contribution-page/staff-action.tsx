import { Col, Text } from "@dataesr/dsfr-plus";
import EmailSender from "../../api/send-mail";
import type { Contribution } from "../../types";
import { useLocation } from "react-router-dom";

const StaffActions = ({ data, refetch }: { data: Contribution; refetch }) => {
  const location = useLocation();
  const contributorClassName = location.pathname.includes("contributionpage")
    ? "staffSide"
    : "staffSideContact";
  return (
    <>
      {data?.mailSent && (
        <Col className={contributorClassName}>
          <Text size="sm">
            Réponse apportée par {data.responseFrom} le{" "}
            {new Date(data?.mailSentDate).toLocaleDateString()}{" "}
          </Text>
          <Text>{data.mailSent}</Text>
        </Col>
      )}
      <EmailSender contribution={data} refetch={refetch} />
    </>
  );
};

export default StaffActions;
