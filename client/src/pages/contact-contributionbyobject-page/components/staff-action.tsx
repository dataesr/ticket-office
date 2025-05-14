import { useState } from "react";
import EmailSender from "../../../api/send-mail";
import { Col, Text } from "@dataesr/dsfr-plus";
import { StaffActionsProps, Thread } from "../../../types";
import { useLocation } from "react-router-dom";
import MarkdownRenderer from "../../../utils/markdownRenderer";

const StaffActions: React.FC<StaffActionsProps> = ({ data, refetch }) => {
  const location = useLocation();
  const [modalImage, setModalImage] = useState<string | null>(null);

  const containerClassName = location.pathname.includes("contributionpage")
    ? "staffSide-container"
    : "staffSideContact-container";

  return (
    <>
      {data?.threads?.length > 0 && (
        <Col xs="12" className={`message-container ${containerClassName}`}>
          {data.threads.map((thread: Thread, threadIndex) =>
            thread.responses.map((response, index) => {
              const responseDate = new Date(
                response.timestamp
              ).toLocaleDateString();
              const responseTime = new Date(
                response.timestamp
              ).toLocaleTimeString();
              const isStaffResponse = !response.team.includes("user");
              const bubbleClass = isStaffResponse
                ? "staffSide message-bubble"
                : "user-side message-bubble";

              return (
                response.responseMessage && (
                  <div key={`${threadIndex}-${index}`} className={bubbleClass}>
                    <Text size="sm" className="message-content">
                      <MarkdownRenderer content={response?.responseMessage} />
                      <small className="message-metadata">
                        {response.attachments &&
                          Object.entries(response.attachments).length > 0 &&
                          Object.entries(response.attachments).map(
                            ([key, imageValue]) => {
                              const imgSrc = `data:${imageValue.contentType};base64,${imageValue.base64}`;
                              return (
                                <div key={key} style={{ maxWidth: "100%" }}>
                                  <img
                                    onClick={() => setModalImage(imgSrc)}
                                    style={{
                                      maxWidth: "400px",
                                      height: "auto",
                                      borderRadius: "4px",
                                      cursor: "pointer",
                                    }}
                                    src={imgSrc}
                                    alt={`Image ${key}`}
                                  />
                                </div>
                              );
                            }
                          )}
                        Répondu le {responseDate} à {responseTime} par{" "}
                        <span className="message-author">
                          {response.team.includes("user")
                            ? data.name || response.team
                            : response.team}
                        </span>
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

      {modalImage && (
        <div className="image-modal" onClick={() => setModalImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={modalImage} alt="Aperçu" />
            <button
              className="close-button"
              onClick={() => setModalImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default StaffActions;
