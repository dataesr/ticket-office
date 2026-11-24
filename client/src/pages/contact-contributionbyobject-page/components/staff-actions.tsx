import { useState } from "react";
import EmailSender from "../../../components/email-sender";
import { Modal, ModalContent, ModalTitle } from "@dataesr/dsfr-plus";
import { StaffActionsProps, Thread } from "../../../types";
import MarkdownRenderer from "../../../components/markdown-renderer";

const StaffActions: React.FC<StaffActionsProps> = ({ data, refetch }) => {
  const [modalImage, setModalImage] = useState<string | null>(null);

  return (
    <>
      {data?.threads?.length > 0 && (
        <div className="message-container">
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
                    <div className="fr-text--sm message-content">
                      <MarkdownRenderer content={response?.responseMessage} />
                      <small className="message-metadata">
                        {response.attachments &&
                          Object.entries(response.attachments).length > 0 &&
                          Object.entries(response.attachments).map(
                            ([key, imageValue]) => {
                              const imgSrc = `data:${imageValue.contentType};base64,${imageValue.base64}`;
                              return (
                                <button
                                  key={key}
                                  type="button"
                                  className="attachment-thumbnail-btn"
                                  onClick={() => setModalImage(imgSrc)}
                                >
                                  <img
                                    className="attachment-thumbnail"
                                    src={imgSrc}
                                    alt={`Pièce jointe ${key}`}
                                  />
                                </button>
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
                    </div>
                  </div>
                )
              );
            })
          )}
        </div>
      )}

      <EmailSender contribution={data} refetch={refetch} />

      <Modal isOpen={!!modalImage} hide={() => setModalImage(null)} size="lg">
        <ModalTitle>Aperçu de la pièce jointe</ModalTitle>
        <ModalContent>
          {modalImage && (
            <img className="attachment-preview" src={modalImage} alt="Aperçu" />
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default StaffActions;
