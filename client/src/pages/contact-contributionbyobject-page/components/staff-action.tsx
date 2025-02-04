import { Col, Text } from "@dataesr/dsfr-plus";
import EmailSender from "../../../api/send-mail";
import { useLocation } from "react-router-dom";
import "./styles.scss";
import { StaffActionsProps, Thread, ThreadResponse } from "../types";
import { makeLinksClickable } from "../../../utils/make-links-clickable";

const StaffActions: React.FC<StaffActionsProps> = ({ data, refetch }) => {
  const location = useLocation();

  const contributorClassName = location.pathname.includes("contributionpage")
    ? "staffSide"
    : "staffSideContact";

  const cleanResponseMessage = (message: string) => {
    return message
      ?.replace(/De:.*$/s, "")
      ?.replace(/Objet :.*$/s, "")
      ?.replace(/Envoyé :.*$/s, "")
      ?.replace(/> Le.*/s, "")
      ?.replace(/Le lun.*$/s, "")
      ?.replace(/Le mar.*$/s, "")
      ?.replace(/Le mer.*$/s, "")
      ?.replace(/Le jeu.*$/s, "")
      ?.replace(/Le ven.*$/s, "")
      ?.replace(/Le sam.*$/s, "")
      ?.replace(/Le dim.*$/s, "")
      ?.replace(/--[a-fA-F0-9_-]+--/g, "")
      .replace(/Content-Type:.*$/gs, "")
      .replace(/Content-Disposition:.*$/gs, "")
      .replace(/Content-Transfer-Encoding:.*$/gs, "")
      .replace(/base64[^ ]+/gs, "[Image ou fichier ignoré]")
      ?.replace(/<br\s*\/?>/g, "\n")
      ?.trim();
  };

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
                      <span
                        dangerouslySetInnerHTML={{
                          __html: makeLinksClickable(
                            cleanResponseMessage(response.responseMessage)
                          ),
                        }}
                      />
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
