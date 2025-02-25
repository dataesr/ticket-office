import { useState } from "react"
import { Badge, BadgeGroup, Button, ButtonGroup, Col, Container, Notice, Row, Text, Title } from "@dataesr/dsfr-plus"
import { BadgeStatus, StatusLabel } from "../../../utils"
import { FaCopy } from "react-icons/fa"
import "./styles.scss"
import { VariationItemProps } from "../types"
import { CopyButton } from "../../../utils/copy-button"
import EditModal from "./edit-modal"
import VARIATION_TAGS from "../config/tags"
import DownloadFile from "../actions/download-file"
import UploadFile from "../actions/upload-file"
import readCSV from "../_utils/read-csv"
import { getCodeFromBSO } from "../_utils/get-code-from-bso"

const VariationItem: React.FC<VariationItemProps> = ({ variation, refetch }) => {
  const [showModal, setShowModal] = useState(false)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const countCsv = readCSV(variation.csv)
  const codeTag = getCodeFromBSO(variation.structure?.id)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text)
      setTimeout(() => {
        setCopiedText(null)
      }, 2000)
    })
  }

  return (
    <>
      <Row className="fr-mt-3w">
        <BadgeGroup>
          <Badge size="sm" color={BadgeStatus({ status: variation?.status })}>
            {StatusLabel({ status: variation?.status })}
          </Badge>
          <Badge size="sm" color={VARIATION_TAGS.file[variation.tags.file].color}>
            File: {variation.tags.file}
          </Badge>
          <Badge size="sm" color={VARIATION_TAGS.code[codeTag].color}>
            Code: {codeTag}
          </Badge>
          <Badge size="sm" color={VARIATION_TAGS.index[variation.tags.index].color}>
            Index: {variation.tags.index}
          </Badge>
          <Badge size="sm" color={VARIATION_TAGS.notification[variation.tags.notification].color}>
            Notif: {variation.tags.notification}
          </Badge>
          {variation?.comment && variation?.team && (
            <Badge size="sm" color="blue-ecume" className="fr-mr-1w fr-mb-1w">
              {`Commenté par ${variation.team}`}
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
      {!variation.structure?.id && (
        <Notice className="fr-mb-2w" type="warning" closeMode="disallow">
          La demande ne contient pas d'identifiant de structure.
        </Notice>
      )}
      <Row>
        <Col>
          <Text size="sm">
            Email de contact: <strong>{variation.contact.email}</strong>
            <CopyButton text={variation.contact.email} copiedText={copiedText} onCopy={copyToClipboard} />
          </Text>
          <Text size="sm">
            Nom de la structure: <strong>{variation.structure.name}</strong>
            <CopyButton text={variation.structure.name} copiedText={copiedText} onCopy={copyToClipboard} />
          </Text>
          {variation.structure?.id && (
            <Text size="sm">
              ID de la structure: <strong>{variation.structure.id}</strong>
              <CopyButton text={variation.structure.id} copiedText={copiedText} onCopy={copyToClipboard} />
            </Text>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          {variation?.modified_at && !variation?.treated_at && (
            <Text size="sm">
              Édité ({variation?.team || ""})
              <strong>
                : {new Date(variation.modified_at).toLocaleDateString()} à{" "}
                {new Date(variation.modified_at).toLocaleTimeString()}
              </strong>
            </Text>
          )}
          {variation?.treated_at && (
            <Text size="sm">
              Traité ({variation?.team || ""})
              <strong>
                : {new Date(variation.treated_at).toLocaleDateString()} à{" "}
                {new Date(variation.treated_at).toLocaleTimeString()}
              </strong>
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
      <Container fluid className="contributorSideContactMessage">
        <Text size="sm">Le périmètre contient: </Text>
        <ul>
          {!!countCsv.doi && <li className="fr-text--sm fr-mb-0">{`${countCsv.doi} DOI`}</li>}
          {!!countCsv.hal_coll_code && <li className="fr-text--sm fr-mb-0">{`${countCsv.hal_coll_code} hal_coll_code`}</li>}
          {!!countCsv.hal_id && <li className="fr-text--sm fr-mb-0">{`${countCsv.hal_id} hal_id`}</li>}
          {!!countCsv.hal_struct_id && <li className="fr-text--sm fr-mb-0">{`${countCsv.hal_struct_id} hal_struct_id`}</li>}
          {!!countCsv.nnt_etab && <li className="fr-text--sm fr-mb-0">{`${countCsv.nnt_etab} nnt_etab`}</li>}
          {!!countCsv.nnt_id && <li className="fr-text--sm fr-mb-0">{`${countCsv.nnt_id} nnt_id`}</li>}
        </ul>
        <Button variant="text" size="sm" icon="download-line" onClick={() => DownloadFile(variation)}>
          Télécharger le fichier
        </Button>
      </Container>
      <EditModal refetch={refetch} isOpen={showModal} onClose={() => setShowModal(false)} variation={variation} />
      <ButtonGroup isInlineFrom="md" className="fr-mb-5w fr-mt-3w">
        <Button icon="edit-line" onClick={() => setShowModal(true)}>
          Éditer la demande
        </Button>
        <Button
          variant="tertiary"
          icon="upload-line"
          disabled={!variation.structure.id}
          onClick={() => {
            UploadFile(variation)
            refetch()
          }}
        >
          Uploader le fichier
        </Button>
      </ButtonGroup>
    </>
  )
}

export default VariationItem
