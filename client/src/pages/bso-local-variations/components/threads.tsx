import { Container, Col, Text } from "@dataesr/dsfr-plus"
import { Variation } from "../types"
import { Thread } from "../../../types"
import MarkdownRenderer from "../../../utils/markdownRenderer"

export default function Threads({ variation }: { variation: Variation }) {
  return (
    <Container fluid>
      {variation?.threads?.length > 0 && (
        <Col offsetMd="3" className="staffSide fr-my-0 fr-py-0">
          {variation.threads.map((thread: Thread, threadIndex) =>
            thread.responses.map((response, index) => {
              const responseDate = new Date(response.timestamp).toLocaleDateString()
              const responseTime = new Date(response.timestamp).toLocaleTimeString()

              const isStaffResponse = !response.team.includes("user")
              const className = isStaffResponse ? "staffSide" : "user-side"

              return (
                response.responseMessage && (
                  <div key={`${threadIndex}-${index}`} className={className}>
                    <Text size="sm" className="fr-mb-0">
                      <MarkdownRenderer content={response?.responseMessage} />
                      <br />
                      <small>
                        Répondu le {responseDate} à {responseTime} par{" "}
                        {response.team.includes("user") ? variation.contact.email || response.team : response.team}
                      </small>
                    </Text>
                  </div>
                )
              )
            })
          )}
        </Col>
      )}
    </Container>
  )
}
