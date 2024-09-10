import { Col, Text } from "@dataesr/dsfr-plus";
import "./styles.scss";
import { Contribute_Production } from "../../../types";
import EmailSender from "../../../api/send-mail";

const StaffProductionActions = ({
  data,
  refetch,
}: {
  data: Contribute_Production;
  refetch;
}) => {
  return (
    <>
      {data?.threads?.[0] && (
        <Col className="staffSide">
          <Text size="sm">
            {data.responseFrom !== "" ? "Réponse apportée par " : ""}
            {data.responseFrom}
            {" le "}
            {new Date(
              data?.threads?.[0]?.responses?.[0].timestamp
            ).toLocaleDateString()}
            {" à "}
            {new Date(
              data?.threads?.[0]?.responses?.[0].timestamp
            ).toLocaleTimeString()}
          </Text>
          <Text>{data?.threads?.[0]?.toString()}</Text>
        </Col>
      )}
      <EmailSender contribution={data} refetch={refetch} />
    </>
  );
};

export default StaffProductionActions;
