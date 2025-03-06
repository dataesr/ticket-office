import { Col, Text } from "@dataesr/dsfr-plus";
import "./styles.scss";
import EmailSender from "../../api/send-mail";
import { StaffProductionActionsProps } from "../../types";
import MarkdownRenderer from "../../utils/markdownRenderer";

const StaffProductionActions = ({
  data,
  refetch,
}: StaffProductionActionsProps) => {
  const contributorClassName = location.pathname.includes("apioperations")
    ? "staffSide"
    : "staffSideContact";

  return (
    <>
      {data?.threads?.length > 0 && (
        <Col className={contributorClassName}>
          {data.threads.map((thread, threadIndex) =>
            thread.responses.map((response, index) => {
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
      <EmailSender contribution={data as any} refetch={refetch} />
    </>
  );
};

export default StaffProductionActions;
