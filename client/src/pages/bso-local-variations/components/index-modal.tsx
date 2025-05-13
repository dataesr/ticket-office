import { Modal, ModalTitle, ModalContent, Container, Button, ModalFooter, TextArea, TextInput } from "@dataesr/dsfr-plus"
import { useVariationsContext } from "../context"
import { Variation } from "../types"
import { useState } from "react"
import updateIndex from "../actions/update-index"

function getDefaultIndexName() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  return `bso-publications-${year}${month}${day}`
}
function isValidIndexNameFormat(indexName: string) {
  // Regular expression to match the "bso-publications-YYYYMMDD" format
  const datePattern = /^bso-publications-\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/
  return datePattern.test(indexName)
}
const defaultIndexName = getDefaultIndexName()
const defaultJSON = {
  skip_download: false,
  observations: ["20180927", "20191122", "20201009", "20211201", "20221201", "20231214", "20241203"],
  hal_dates: ["20221201", "20231214", "20241201"],
  theses_date: "20241201",
  datasources: ["medline/24", "parsed_fr", "crossref_fr", "hal", "theses", "fixed", "local", "bso3"],
  chunksize: 5000,
}

const prettifyJSON = (obj) => JSON.stringify(obj, undefined, 4)

type IndexModalProps = {
  variations: Array<Variation>
  isOpen: boolean
  onClose: () => void
}
export default function IndexModal({ variations, isOpen, onClose }: IndexModalProps) {
  const {
    api,
    data: { refetch },
  } = useVariationsContext()
  const [indexName, setIndexName] = useState<string>(defaultIndexName)
  const [textJSON, setTextJSON] = useState<string>(prettifyJSON(defaultJSON))
  const [isValidIndexName, setIsValidIndexName] = useState<boolean>(true)
  const [isValidJSON, setIsValidJSON] = useState<boolean>(true)
  const [errorJSON, setErrorJSON] = useState<Error>(null)

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    setIndexName(name)
    setIsValidIndexName(isValidIndexNameFormat(name))
  }

  const handleParamsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value
    setTextJSON(text)
    try {
      const json = JSON.parse(text)
      const pretty = JSON.stringify(json, undefined, 8)
      setTextJSON(pretty)
      setIsValidJSON(true)
      setErrorJSON(null)
    } catch (error) {
      setIsValidJSON(false)
      setErrorJSON(error)
    }
  }

  const handleClose = () => {
    setIndexName(defaultIndexName)
    setTextJSON(prettifyJSON(defaultJSON))
    setIsValidIndexName(true)
    setIsValidJSON(true)
    setErrorJSON(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} hide={handleClose}>
      <ModalTitle>
        Relancer un index BSO pour {variations.length === 1 ? "1 demande" : `${variations.length} demandes`}
      </ModalTitle>
      <ModalContent>
        <ul>
          {variations.map((variation, index) => (
            <li key={index}>{`${variation.structure.name} - ${variation.structure?.id}`}</li>
          ))}
        </ul>
        <hr />
        <TextInput
          label="Nom de l'index"
          placeholder={defaultIndexName}
          value={indexName}
          onChange={handleNameChange}
          messageType={isValidIndexName ? "" : "error"}
          message={isValidIndexName ? "" : "Le nom de l'index doit être au format 'bso-publications-YYYYMMDD'"}
          required
        />
        <TextArea
          label="Paramètres de l'index"
          style={{ resize: "none", borderColor: isValidJSON ? "initial" : "red" }}
          value={textJSON}
          onChange={handleParamsChange}
          rows={10}
          messageType={errorJSON ? "error" : ""}
          message={errorJSON ? errorJSON.message : ""}
        />
      </ModalContent>
      <ModalFooter>
        <Container style={{ display: "flex", width: "100%", alignItems: "center" }}>
          <div style={{ flexGrow: 1 }}>
            <Button variant="secondary" onClick={handleClose}>
              Annuler
            </Button>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              updateIndex(api, variations, { index_name: indexName, ...JSON.parse(textJSON) })
              refetch()
            }}
            disabled={!isValidIndexName || !isValidJSON}
          >
            Relancer
          </Button>
        </Container>
      </ModalFooter>
    </Modal>
  )
}
