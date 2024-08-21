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
      {data?.mailSent && (
        <Col className="staffSide">
          <Text size="sm">
            {data.responseFrom !== "" ? "Réponse apportée par " : ""}
            {data.responseFrom}
            {" le "}
            {new Date(data?.mailSentDate).toLocaleDateString()}{" "}
          </Text>
          <Text>{data.mailSent}</Text>
        </Col>
      )}
      <EmailSender contribution={data} refetch={refetch} objectType="contact" />
    </>
  );
};

export default StaffProductionActions;
