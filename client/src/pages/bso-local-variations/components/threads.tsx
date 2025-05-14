import { Container, Col, Text } from "@dataesr/dsfr-plus";
import { Variation } from "../types";
import { Thread } from "../../../types";
import MarkdownRenderer from "../../../utils/markdownRenderer";
import { useState } from "react";

export default function Threads({ variation }: { variation: Variation }) {
  const [modalImage, setModalImage] = useState<string | null>(null);

  return (
    <Container fluid>
      {variation?.threads?.length > 0 && (
        <Col className="fr-my-0 fr-py-0">
          {variation.threads.map((thread: Thread, threadIndex) =>
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
                    <Text size="sm" className="fr-mb-0">
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
                        {response.team.includes("user")
                          ? variation.contact.email || response.team
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
    </Container>
  );
}
