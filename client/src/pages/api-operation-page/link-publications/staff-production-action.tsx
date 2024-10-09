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
      {data?.threads?.length > 0 && (
        <Col className="staffSide">
          {data.threads.map((thread) =>
            thread.responses.map((response, index) => (
              <Text size="sm" key={index}>
                Réponse apportée par {response.team.join(", ")} le{" "}
                {new Date(response.timestamp).toLocaleDateString()}
                {" à "}
                {new Date(response.timestamp).toLocaleTimeString()} :<br />
                {response.responseMessage}
              </Text>
            ))
          )}
        </Col>
      )}
      <EmailSender contribution={data} refetch={refetch} />
    </>
  );
};

export default StaffProductionActions;
