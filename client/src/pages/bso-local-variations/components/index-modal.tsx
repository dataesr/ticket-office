import { Modal, ModalTitle, ModalContent, Container, Button, ModalFooter, TextArea, Alert, Notice } from "@dataesr/dsfr-plus"
import { useVariationsContext } from "../context"
import { Variation } from "../types"
import { useState } from "react"
import updateIndex from "../actions/update-index"

const defaultJSON = {
  index_name: "bso-publications-20250102",
  reset_file: false,
  extract: false,
  transform: true,
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
    data: { refetch },
  } = useVariationsContext()
  const [textJSON, setTextJSON] = useState<string>(prettifyJSON(defaultJSON))
  const [isValid, setIsValid] = useState<boolean>(true)
  const [validationError, setValidationError] = useState<Error>(null)

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value
    setTextJSON(text)
    try {
      const json = JSON.parse(text)
      if ("index_name" in json) {
        const pretty = JSON.stringify(json, undefined, 8)
        setTextJSON(pretty)
        setIsValid(true)
        setValidationError(null)
      } else {
        setIsValid(false)
        setValidationError(new Error('"index_name" is missing!'))
      }
    } catch (error) {
      setIsValid(false)
      setValidationError(error)
    }
  }

  const handleClose = () => {
    setTextJSON(prettifyJSON(defaultJSON))
    setIsValid(true)
    setValidationError(null)
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
        <Notice type="info" closeMode="disallow">
          N'oubliez pas de changer le champ 'index_name' !
        </Notice>
        <TextArea
          style={{ resize: "none", borderColor: isValid ? "initial" : "red" }}
          value={textJSON}
          onChange={handleChange}
          rows={10}
        />
        {validationError && <Alert variant="warning" description={validationError.message} />}
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
              updateIndex(variations, JSON.parse(textJSON))
              refetch()
            }}
            disabled={!isValid}
          >
            Relancer
          </Button>
        </Container>
      </ModalFooter>
    </Modal>
  )
}
