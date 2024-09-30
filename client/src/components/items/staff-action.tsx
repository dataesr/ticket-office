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
      {data?.threads?.length > 0 && (
        <Col className={contributorClassName}>
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

export default StaffActions;
