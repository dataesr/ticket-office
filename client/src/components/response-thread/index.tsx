import { useState } from "react";
import { Modal, ModalContent, ModalTitle } from "@dataesr/dsfr-plus";
import MarkdownRenderer from "../markdown-renderer";
import { Thread } from "../../types";
import "./styles.scss";

type ResponseThreadProps = {
  threads?: Thread[];
  contributorName?: string;
};

const ResponseThread = ({ threads, contributorName }: ResponseThreadProps) => {
  const [modalImage, setModalImage] = useState<string | null>(null);

  if (!threads?.length) return null;

  return (
    <>
      <div className="response-thread">
        {threads.map((thread, threadIndex) =>
          thread.responses.map((response, index) => {
            if (!response.responseMessage) return null;

            const isFromUser = response.team.includes("user");
            const date = new Date(response.timestamp);

            return (
              <div
                key={`${threadIndex}-${index}`}
                className={`response-thread__message response-thread__message--${isFromUser ? "user" : "staff"}`}
              >
                <div className="fr-text--sm response-thread__content">
                  <MarkdownRenderer content={response.responseMessage} />
                  <small className="response-thread__metadata">
                    {response.attachments &&
                      Object.entries(response.attachments).map(
                        ([key, imageValue]) => {
                          const imgSrc = `data:${imageValue.contentType};base64,${imageValue.base64}`;
                          return (
                            <button
                              key={key}
                              type="button"
                              className="response-thread__attachment-button"
                              onClick={() => setModalImage(imgSrc)}
                            >
                              <img
                                className="response-thread__attachment"
                                src={imgSrc}
                                alt={`Pièce jointe ${key}`}
                              />
                            </button>
                          );
                        }
                      )}
                    Répondu le {date.toLocaleDateString()} à{" "}
                    {date.toLocaleTimeString()} par{" "}
                    <span className="response-thread__author">
                      {isFromUser
                        ? contributorName || response.team
                        : response.team}
                    </span>
                  </small>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal isOpen={!!modalImage} hide={() => setModalImage(null)} size="lg">
        <ModalTitle>Aperçu de la pièce jointe</ModalTitle>
        <ModalContent>
          {modalImage && (
            <img
              className="response-thread__attachment-preview"
              src={modalImage}
              alt="Aperçu"
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ResponseThread;
