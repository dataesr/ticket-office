import EmailSender from "../../api/send-mail";
import type { Contribute_Production } from "../../types";
import { useState } from "react";
import { Col, Text } from "@dataesr/dsfr-plus";

const StaffProductionActions = ({ data }: { data: Contribute_Production }) => {
  const [responseScanR, setResponseScanR] = useState(null);

  return (
    <>
      {data?.comment && (
        <Col className="staffSide">
          <Text size="sm">
            Réponse apportée par {responseScanR?.responseFrom || data.team[0]}{" "}
            le {new Date(data?.modified_at).toLocaleDateString()}{" "}
          </Text>
          <Text>{responseScanR?.comment || data.comment}</Text>
        </Col>
      )}
      <EmailSender contribution={data} setResponseScanR={setResponseScanR} />
    </>
  );
};

export default StaffProductionActions;
