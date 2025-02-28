import { Col, Text } from "@dataesr/dsfr-plus";
import "./styles.scss";
import EmailSender from "../../api/send-mail";
import { StaffProductionActionsProps } from "../../types";

const StaffProductionActions = ({
  data,
  refetch,
}: StaffProductionActionsProps) => {
  return (
    <>
      {data?.threads?.length > 0 && (
        <Col className="staffSide">
          {data.threads.map((thread, threadIndex) =>
            thread.responses.map((response, responseIndex) => (
              <Text size="sm" key={`${threadIndex}-${responseIndex}`}>
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
      <EmailSender contribution={data as any} refetch={refetch} />
    </>
  );
};

export default StaffProductionActions;
