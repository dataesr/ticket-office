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
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
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
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
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
>>>>>>> 63f1edf (chore(staff-actions): update fields)
        </Col>
      )}
      <EmailSender contribution={data} refetch={refetch} />
    </>
  );
};

export default StaffProductionActions;
