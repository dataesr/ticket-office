import { Col, Text } from "@dataesr/dsfr-plus";
import EmailSender from "../../api/send-mail";
import type { Contribution } from "../../types";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const StaffActions = ({ data }: { data: Contribution }) => {
  const location = useLocation();
  const [responseScanR, setResponseScanR] = useState(null);
  const contributorClassName = location.pathname.includes("contributionpage")
    ? "staffSide"
    : "staffSideContact";
  return (
    <>
      {data?.mailSent && (
        <Col className={contributorClassName}>
          <Text size="sm">
            Réponse apportée par{" "}
            {responseScanR?.responseFrom || data.responseFrom} le{" "}
            {new Date(
              responseScanR?.mailSentData || data?.mailSentDate
            ).toLocaleDateString()}{" "}
          </Text>
          <Text>{responseScanR?.mailSent || data.mailSent}</Text>
        </Col>
      )}
      <EmailSender contribution={data} setResponseScanR={setResponseScanR} />
    </>
  );
};

export default StaffActions;
