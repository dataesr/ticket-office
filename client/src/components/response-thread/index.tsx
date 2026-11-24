import { useState } from "react";
import {
  Button,
  Col,
  Modal,
  ModalContent,
  ModalTitle,
  Row,
  Text,
} from "@dataesr/dsfr-plus";
import MarkdownRenderer from "../markdown-renderer";
import { Thread } from "../../types";

type ResponseThreadProps = {
  threads?: Thread[];
  contributorName?: string;
};

const ResponseThread = ({ threads, contributorName }: ResponseThreadProps) => {
  const [modalImage, setModalImage] = useState<string | null>(null);

  if (!threads?.length) return null;

  return (
    <>
      {threads.map((thread, threadIndex) =>
        thread.responses.map((response, index) => {
          if (!response.responseMessage) return null;

          const isFromUser = response.team.includes("user");
          const date = new Date(response.timestamp);

          return (
            <Row key={`${threadIndex}-${index}`}>
              <Col xs={12} md={9} offsetMd={isFromUser ? undefined : 3}>
                <div
                  className={`fr-p-2w fr-mb-2w ${isFromUser ? "fr-background-alt--pink-macaron" : "fr-background-alt--blue-ecume"}`}
                >
                  <MarkdownRenderer content={response.responseMessage} />
                  {response.attachments &&
                    Object.entries(response.attachments).map(
                      ([key, imageValue]) => {
                        const imgSrc = `data:${imageValue.contentType};base64,${imageValue.base64}`;
                        return (
                          <Button
                            key={key}
                            type="button"
                            variant="text"
                            onClick={() => setModalImage(imgSrc)}
                          >
                            <img
                              src={imgSrc}
                              width={256}
                              alt={`Agrandir la pièce jointe ${key}`}
                            />
                          </Button>
                        );
                      }
                    )}
                  <Text size="xs" className="fr-text-mention--grey fr-mb-0">
                    Répondu le {date.toLocaleDateString()} à{" "}
                    {date.toLocaleTimeString()} par{" "}
                    <strong>
                      {isFromUser
                        ? contributorName || response.team
                        : response.team}
                    </strong>
                  </Text>
                </div>
              </Col>
            </Row>
          );
        })
      )}

      <Modal isOpen={!!modalImage} hide={() => setModalImage(null)} size="lg">
        <ModalTitle>Aperçu de la pièce jointe</ModalTitle>
        <ModalContent>
          {modalImage && (
            <img className="fr-responsive-img" src={modalImage} alt="Aperçu" />
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ResponseThread;
