import { useState } from "react"
import { Badge, BadgeGroup, Button, ButtonGroup, Col, Container, Notice, Row, Text, Title } from "@dataesr/dsfr-plus"
import { BadgeStatus, StatusLabel } from "../../../utils"
import { FaCopy } from "react-icons/fa"
import "../styles/styles.scss"
import { VariationItemProps } from "../types"
import { CopyButton } from "../../../utils/copy-button"
import EditModal from "./edit-modal"
import { tagGetColor, tagGetIcon } from "../config/tags"
import downloadFile from "../actions/download-file"
import readCSV from "../_utils/read-csv"
import { useVariationsContext } from "../context"
import Threads from "./threads"
import UploadModal from "./upload-modal"
import EmailBox from "./email-box"
import getBsoTaskStatus from "../_utils/get-bso-task-status"
import getFileContent from "../_utils/get-file-content"

const VariationItem: React.FC<VariationItemProps> = ({ variation }) => {
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false)
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const { getCodeFromBSO, getCommentsNameFromBSO } = useVariationsContext()

  const countCsv = readCSV(variation.csv)
  const { content: remoteContent, refetch } = getFileContent(variation.structure?.id)
  const countRemoteCsv = readCSV(remoteContent)
  const indexTag: string = getBsoTaskStatus(variation.tags?.index)
  const codeTag: string = getCodeFromBSO(variation.structure?.id)
  const commentsName: string = getCommentsNameFromBSO(variation.structure?.id)

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
      <Row>
        <BadgeGroup>
          <Badge size="sm" color={BadgeStatus({ status: variation?.status })}>
            {StatusLabel({ status: variation?.status })}
          </Badge>
          <Badge
            size="sm"
            color={tagGetColor("file", variation?.tags?.file)}
            icon={tagGetIcon("file", variation?.tags?.file)}
          >
            File: {variation.tags.file || "none"}
          </Badge>
          <Badge size="sm" color={tagGetColor("code", codeTag)} icon={tagGetIcon("code", codeTag)}>
            Config: {codeTag}
          </Badge>
          <Badge size="sm" color={tagGetColor("index", indexTag)} icon={tagGetIcon("index", indexTag)}>
            Index: {indexTag}
          </Badge>
          <Badge
            size="sm"
            color={tagGetColor("notification", variation?.tags?.notification)}
            icon={tagGetIcon("notification", variation?.tags?.notification)}
          >
            Notif: {variation.tags.notification || "none"}
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
          La demande ne contient pas d'identifiant de structure!
        </Notice>
      )}
      {commentsName && variation.structure?.acronym && !commentsName.includes(variation.structure.acronym) && (
        <Notice className="fr-mb-2w" type="warning" closeMode="disallow">
          L'acronyme renseigné diffère de la configuration BSO!
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
          <Text size="sm">
            ID de la structure: <strong>{variation.structure?.id || "Non renseigné"}</strong>
            <CopyButton text={variation.structure.id} copiedText={copiedText} onCopy={copyToClipboard} />
          </Text>
          <Row>
            <Text size="sm">
              Acronyme de la structure: <strong>{variation.structure?.acronym || "Non renseigné"}</strong>
              <CopyButton text={variation.structure.acronym} copiedText={copiedText} onCopy={copyToClipboard} />
            </Text>
            <Text className="fr-ml-2w" size="sm">
              {"(Config: "}
              <strong>{commentsName || "Non renseigné"}</strong>
              {") "}
            </Text>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          {variation?.modified_at && !variation?.treated_at && (
            <Text size="sm">
              {variation.team ? `Édité par ${variation.team} le ` : ""}
              <strong>
                {new Date(variation.modified_at).toLocaleDateString()} à{" "}
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
      <Row>
        <Col md={7} lg={7}>
          <Container fluid className="fileContentRequest">
            <Text size="sm">Le périmètre contient: </Text>
            <ul>
              {!!countCsv.doi && <li className="fr-text--sm fr-mb-0">{`${countCsv.doi} DOI`}</li>}
              {!!countCsv.hal_coll_code && (
                <li className="fr-text--sm fr-mb-0">{`${countCsv.hal_coll_code} hal_coll_code`}</li>
              )}
              {!!countCsv.hal_id && <li className="fr-text--sm fr-mb-0">{`${countCsv.hal_id} hal_id`}</li>}
              {!!countCsv.hal_struct_id && (
                <li className="fr-text--sm fr-mb-0">{`${countCsv.hal_struct_id} hal_struct_id`}</li>
              )}
              {!!countCsv.nnt_etab && <li className="fr-text--sm fr-mb-0">{`${countCsv.nnt_etab} nnt_etab`}</li>}
              {!!countCsv.nnt_id && <li className="fr-text--sm fr-mb-0">{`${countCsv.nnt_id} nnt_id`}</li>}
            </ul>
            <Button
              variant="text"
              size="sm"
              icon="download-line"
              onClick={() => downloadFile(variation)}
              disabled={!variation.csv}
            >
              Télécharger le fichier
            </Button>
          </Container>
        </Col>
        <Col md={5} lg={5}>
          <Container fluid className="fileContentRemote">
            {remoteContent ? (
              <>
                <Text size="sm">{`Fichier ${variation.structure?.id}.csv trouvé sur OVH: `}</Text>
                {countRemoteCsv && (
                  <ul>
                    {!!countRemoteCsv.doi && <li className="fr-text--sm fr-mb-0">{`${countRemoteCsv.doi} DOI`}</li>}
                    {!!countRemoteCsv.hal_coll_code && (
                      <li className="fr-text--sm fr-mb-0">{`${countRemoteCsv.hal_coll_code} hal_coll_code`}</li>
                    )}
                    {!!countRemoteCsv.hal_id && <li className="fr-text--sm fr-mb-0">{`${countRemoteCsv.hal_id} hal_id`}</li>}
                    {!!countRemoteCsv.hal_struct_id && (
                      <li className="fr-text--sm fr-mb-0">{`${countRemoteCsv.hal_struct_id} hal_struct_id`}</li>
                    )}
                    {!!countRemoteCsv.nnt_etab && (
                      <li className="fr-text--sm fr-mb-0">{`${countRemoteCsv.nnt_etab} nnt_etab`}</li>
                    )}
                    {!!countRemoteCsv.nnt_id && <li className="fr-text--sm fr-mb-0">{`${countRemoteCsv.nnt_id} nnt_id`}</li>}
                  </ul>
                )}
              </>
            ) : (
              <Text size="sm">{`Fichier ${variation.structure?.id}.csv non trouvé sur OVH. `}</Text>
            )}
            <Button variant="text" size="sm" icon="refresh-line" onClick={() => refetch()}>
              Actualiser
            </Button>
          </Container>
        </Col>
      </Row>
      <EditModal variations={[variation]} isOpen={showEditModal} onClose={() => setShowEditModal(false)} />
      <UploadModal variations={[variation]} isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} />
      <ButtonGroup isInlineFrom="md" className="fr-mb-5w fr-mt-3w">
        <Button icon="edit-line" onClick={() => setShowEditModal(true)}>
          Éditer la demande
        </Button>
        <Button
          variant="secondary"
          icon="server-line"
          disabled={!variation.structure.id}
          onClick={() => setShowUploadModal(true)}
        >
          Charger le fichier sur OVH
        </Button>
      </ButtonGroup>
      <Threads variation={variation} />
      <EmailBox variation={variation} />
    </>
  )
}

export default VariationItem
