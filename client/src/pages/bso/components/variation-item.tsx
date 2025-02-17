import { useState } from "react"
import { Badge, BadgeGroup, Button, Col, Row, Text, Title } from "@dataesr/dsfr-plus"
import { BadgeStatus, StatusLabel } from "../../../utils"
import { FaCopy } from "react-icons/fa"
import "./styles.scss"
import { VariationItemProps } from "../types"
import { CopyButton } from "../../../utils/copy-button"
import EditModal from "./edit-modal"

const VariationItem: React.FC<VariationItemProps> = ({ variation, refetch }) => {
  const [showModal, setShowModal] = useState(false)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text)
      setTimeout(() => {
        setCopiedText(null)
      }, 2000)
    })
  }

  console.log("variation-item", variation)

  return (
    <>
      <Row className="fr-mt-3w">
        <BadgeGroup>
          <Badge size="sm" color={BadgeStatus({ status: variation?.status })}>
            {StatusLabel({ status: variation?.status })}
          </Badge>
          <Badge size="sm">File: {variation.tags.file}</Badge>
          <Badge size="sm">Code: {variation.tags.code}</Badge>
          <Badge size="sm">Index: {variation.tags.index}</Badge>
          <Badge size="sm">Notif: {variation.tags.notification}</Badge>
          {variation?.comment && variation?.team?.length > 0 && (
            <Badge size="sm" color="green-emeraude" className="fr-mr-1w fr-mb-1w">
              {`Commenté par ${variation.team[0]}`}
            </Badge>
          )}
        </BadgeGroup>
      </Row>
      <Row>
        <Col>
          <Title look="h5">
            {variation.structure.name} ({variation.id})
            <button
              className={`copy-button ${copiedText === variation.id ? "copied" : ""}`}
              onClick={() => copyToClipboard(variation?.id)}
            >
              {copiedText === variation.id && <span className="copied-text">Copié</span>}
              <FaCopy size={14} color="#2196f3" className="copy-icon" />
            </button>
          </Title>
        </Col>
        <Text size="sm">
          <i className="date">Reçu le {new Date(variation.created_at)?.toLocaleDateString()}</i>
        </Text>
      </Row>
      <Row>
        <Col>
          <Text size="sm">
            Email de contact: {variation.contact.email}
            <CopyButton text={variation.contact.email} copiedText={copiedText} onCopy={copyToClipboard} />
          </Text>
          <Text size="sm">
            Nom de la structure: {variation.structure.name}
            <CopyButton text={variation.structure.name} copiedText={copiedText} onCopy={copyToClipboard} />
          </Text>
          {variation.structure?.ids?.siren && (
            <Text size="sm">
              SIREN de la structure: {variation.structure.ids.siren}
              <CopyButton text={variation.structure.ids.siren} copiedText={copiedText} onCopy={copyToClipboard} />
            </Text>
          )}
          {variation.structure?.ids?.rnsr && (
            <Text size="sm">
              RNSR de la structure: {variation.structure.ids.rnsr}
              <CopyButton text={variation.structure.ids.rnsr} copiedText={copiedText} onCopy={copyToClipboard} />
            </Text>
          )}
          {variation.structure?.ids?.ror && (
            <Text size="sm">
              ROR de la structure: {variation.structure.ids.ror}
              <CopyButton text={variation.structure.ids.ror} copiedText={copiedText} onCopy={copyToClipboard} />
            </Text>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          {variation?.modified_at && (
            <Text size="sm">
              Édité ({variation.team ? variation.team[0] : ""}){" "}
              <strong>: {new Date(variation.modified_at).toLocaleDateString()}</strong>
            </Text>
          )}
        </Col>
        <Col>
          {variation?.comment && (
            <Text size="sm">
              Commentaire ({variation.team ? variation.team[0] : ""}) <strong>: {variation.comment}</strong>
            </Text>
          )}
        </Col>
      </Row>
      <EditModal refetch={refetch} isOpen={showModal} onClose={() => setShowModal(false)} variation={variation} />
      <Row className="fr-mb-5w fr-mt-3w">
        <Button onClick={() => setShowModal(true)}>Éditer la demande</Button>
      </Row>
    </>
  )
}

export default VariationItem
