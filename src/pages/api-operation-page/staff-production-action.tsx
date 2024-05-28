import { useState } from "react";
import { Col, Text } from "@dataesr/dsfr-plus";
import "./styles.scss";
import EmailSender from "../../api/send-mail";
import { Contribute_Production } from "../../types";

const StaffProductionActions = ({ data }: { data: Contribute_Production }) => {
  const [responseScanR, setResponseScanR] = useState(null);

  return (
    <>
      {data?.mailSent && (
        <Col className="staffSide">
          <Text size="sm">
            {(responseScanR?.responseFrom || data.responseFrom) !== ""
              ? "Réponse apportée par "
              : ""}
            {responseScanR?.responseFrom || data.responseFrom}
            {" le "}
            {new Date(data?.mailSentDate).toLocaleDateString()}{" "}
          </Text>
          <Text>{responseScanR?.mailSent || data.mailSent}</Text>
        </Col>
      )}
      <EmailSender contribution={data} setResponseScanR={setResponseScanR} />
    </>
  );
};

export default StaffProductionActions;
