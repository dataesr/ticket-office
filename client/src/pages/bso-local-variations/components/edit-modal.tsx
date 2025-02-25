import { useEffect, useState } from "react"
import {
  Modal,
  ModalTitle,
  ModalContent,
  Col,
  TextArea,
  Button,
  Row,
  Tab,
  Tabs,
  TextInput,
  Container,
} from "@dataesr/dsfr-plus"
import { toast } from "react-toastify"
import ProfileModal from "../../../components/profil-modal"
import { VARIATION_TAGS } from "../config/tags"
import { EditModalInputs, EditModalProps } from "../types"
import useEdit from "../hooks/useEdit"
import { useVariationsContext } from "../context"
import getStatusFromTags from "../_utils/get-status-from-tags"

const EditModal: React.FC<EditModalProps> = ({ variation, isOpen, onClose }) => {
  const {
    data: { refetch },
  } = useVariationsContext()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState(localStorage.getItem("selectedProfile"))
  const [inputs, setInputs] = useState<EditModalInputs>({})

  useEffect(() => {
    if (!selectedProfile) {
      setShowProfileModal(true)
    } else {
      inputs.team = selectedProfile
    }
  }, [selectedProfile])

  const resetInputs = () => setInputs({})

  const handleInputChange = (key: string, value: string) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [key]: value,
    }))
  }

  const handleContactChange = (key: string, value: string) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      contact: {
        ...prevInputs.contact,
        [key]: value,
      },
    }))
  }

  const handleStructureChange = (key: string, value: string) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      structure: {
        ...prevInputs.structure,
        [key]: value,
      },
    }))
  }

  const handleTagChange = (tag: string, value: string) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      tags: {
        ...prevInputs.tags,
        [tag]: value,
      },
    }))
  }

  const handleSubmit = async () => {
    if (!selectedProfile || selectedProfile === "null" || selectedProfile === "") {
      setShowProfileModal(true)
      return
    }

    if (inputs?.tags) inputs.status = getStatusFromTags({ ...variation?.tags, ...inputs.tags })

    await useEdit(variation.id, inputs)
      .then(() => {
        refetch()
        onClose()
        toast.success("Les modifications ont été enregistrées avec succès !")
      })
      .catch((error) => {
        console.error("Une erreur est survenue lors de l'enregistrement: ", error.message)
        toast.error("Une erreur est survenue lors de l'enregistrement")
      })
  }

  const handleClose = () => {
    resetInputs()
    onClose()
  }

  return (
    <>
      <Modal isOpen={isOpen} hide={onClose}>
        <ModalTitle>Éditer la demande</ModalTitle>
        <ModalContent>
          <Tabs>
            <Tab label="Infos" icon="user-line">
              <TextInput
                label="Email de contact"
                defaultValue={variation.contact.email}
                onChange={(e) => handleContactChange("email", e.target.value)}
              />
              <TextInput
                label="Nom de la structure"
                defaultValue={variation.structure.name}
                onChange={(e) => handleStructureChange("name", e.target.value)}
              />
              <TextInput
                label="ID de la structure"
                defaultValue={variation.structure?.id}
                onChange={(e) => handleStructureChange("id", e.target.value)}
              />
              <Container fluid style={{ display: "flex", width: "100%", alignItems: "center" }}>
                <div style={{ flexGrow: 1 }}>
                  <Button variant="secondary" onClick={handleClose}>
                    Annuler
                  </Button>
                </div>
                <Button variant="primary" onClick={handleSubmit}>
                  Enregistrer
                </Button>
              </Container>
            </Tab>
            <Tab label="Status" icon="checkbox-line">
              <div className="fr-select-group">
                <label htmlFor="statusInput" className="fr-label">
                  Statut
                </label>
                <select
                  id="statusInput"
                  name="status"
                  value={inputs?.status || variation.status || "none"}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="fr-select"
                >
                  <option value={"new"}>Nouveau</option>
                  <option value={"ongoing"}>En cours</option>
                  <option value={"treated"}>Traité</option>
                </select>
              </div>
              <hr />
              <Row gutters className="fr-mb-1v">
                <Col md="6" xs="12">
                  <div className="fr-select-group">
                    <label htmlFor="fileTagInput" className="fr-label">
                      Fichier
                    </label>
                    <select
                      id="fileTagInput"
                      name="fileTag"
                      value={inputs?.tags?.file || variation?.tags?.file || "none"}
                      onChange={(e) => handleTagChange("file", e.target.value)}
                      className="fr-select"
                    >
                      {Object.entries(VARIATION_TAGS.file).map(([key, { name }]) => (
                        <option key={key} value={key}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <br />
                  <div className="fr-select-group">
                    <label htmlFor="codeTagInput" className="fr-label">
                      Code
                    </label>
                    <select
                      id="codeTagInput"
                      name="codeTag"
                      value={inputs?.tags?.code || variation?.tags?.code || "none"}
                      onChange={(e) => handleTagChange("code", e.target.value)}
                      className="fr-select"
                    >
                      {Object.entries(VARIATION_TAGS.code).map(([key, { name }]) => (
                        <option key={key} value={key}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </Col>
                <Col md="6" xs="12">
                  <div className="fr-select-group">
                    <label htmlFor="indexTagInput" className="fr-label">
                      Index
                    </label>
                    <select
                      id="indexTagInput"
                      name="indexTag"
                      value={inputs?.tags?.index || variation?.tags?.index || "none"}
                      onChange={(e) => handleTagChange("index", e.target.value)}
                      className="fr-select"
                    >
                      {Object.entries(VARIATION_TAGS.index).map(([key, { name }]) => (
                        <option key={key} value={key}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <br />
                  <div className="fr-select-group">
                    <label htmlFor="notificationTagInput" className="fr-label">
                      Messages
                    </label>
                    <select
                      id="notificationTagInput"
                      name="notificationTag"
                      value={inputs?.tags?.notification || variation?.tags?.notification || "none"}
                      onChange={(e) => handleTagChange("notification", e.target.value)}
                      className="fr-select"
                    >
                      {Object.entries(VARIATION_TAGS.notification).map(([key, { name }]) => (
                        <option key={key} value={key}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </Col>
              </Row>
              <hr />
              <TextArea
                label="Commentaire"
                value={inputs.comment}
                onChange={(e) => handleInputChange("comment", e.target.value)}
              />
              <Container style={{ display: "flex", width: "100%", alignItems: "center" }}>
                <div style={{ flexGrow: 1 }}>
                  <Button variant="secondary" onClick={handleClose}>
                    Annuler
                  </Button>
                </div>
                <Button variant="primary" onClick={handleSubmit}>
                  Enregistrer
                </Button>
              </Container>
            </Tab>
          </Tabs>
        </ModalContent>
      </Modal>
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSelectProfile={(profile) => {
          setSelectedProfile(profile)
          localStorage.setItem("selectedProfile", profile)
          setShowProfileModal(false)
        }}
        selectedProfile={selectedProfile}
      />
    </>
  )
}

export default EditModal
