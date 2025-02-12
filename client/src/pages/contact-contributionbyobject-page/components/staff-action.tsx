import { Col, Text } from "@dataesr/dsfr-plus";
import EmailSender from "../../../api/send-mail";
import { useLocation } from "react-router-dom";
import "./styles.scss";
import { StaffActionsProps, Thread, ThreadResponse } from "../types";
import MarkdownRenderer from "../../../utils/markdownRenderer";

const StaffActions: React.FC<StaffActionsProps> = ({ data, refetch }) => {
  const location = useLocation();

  const contributorClassName = location.pathname.includes("contributionpage")
    ? "staffSide"
    : "staffSideContact";

  return (
    <>
      {data?.threads?.length > 0 && (
        <Col className={contributorClassName}>
          {data.threads.map((thread: Thread, threadIndex) =>
            thread.responses.map((response: ThreadResponse, index) => {
              const responseDate = new Date(
                response.timestamp
              ).toLocaleDateString();
              const responseTime = new Date(
                response.timestamp
              ).toLocaleTimeString();

              const isStaffResponse = !response.team.includes("user");
              const className = isStaffResponse ? "staffSide" : "user-side";

              return (
                response.responseMessage && (
                  <div key={`${threadIndex}-${index}`} className={className}>
                    <Text size="sm">
                      <MarkdownRenderer content={response?.responseMessage} />
                      <br />
                      <small>
                        Répondu le {responseDate} à {responseTime} par{" "}
                        {response.team.includes("user")
                          ? data.name || response.team
                          : response.team}
                      </small>
                    </Text>
                  </div>
                )
              );
            })
          )}
        </Col>
      )}

      <EmailSender contribution={data} refetch={refetch} />
    </>
  );
};

export default StaffActions;
