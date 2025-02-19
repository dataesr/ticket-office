import { useEffect, useState } from "react"
import { Modal, ModalTitle, ModalContent, Col, TextArea, Button, Row, ModalFooter } from "@dataesr/dsfr-plus"
import { toast } from "react-toastify"
import { postHeaders } from "../../../config/api"
import ProfileModal from "../../../components/profil-modal"
import VARIATION_TAGS from "../config/tags"
import { EditModalInputs, EditModalProps } from "../types"
import getStatusFromTags from "../_utils/get-status-from-tags"

const EditModal: React.FC<EditModalProps> = ({ isOpen, variation, onClose, refetch }) => {
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState(localStorage.getItem("selectedProfile"))
  const [inputs, setInputs] = useState<EditModalInputs>({
    team: [selectedProfile],
  })

  const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development"
  const baseURL = import.meta.env.VITE_BASE_API_URL
  const url = isDevelopment
    ? `http://localhost:3000/api/variations/${variation.id}`
    : `${baseURL}/api/variations/${variation?.id}`

  useEffect(() => {
    if (!selectedProfile) {
      setShowProfileModal(true)
    }

    if (variation) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        status: variation.status,
        tags: variation.tags,
        comment: variation?.comment || "",
      }))
    }
  }, [selectedProfile, variation])

  const handleInputChange = (key: string, value: string) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [key]: value,
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
    try {
      const body = JSON.stringify({
        ...inputs,
        status: getStatusFromTags(inputs.tags),
        team: [selectedProfile],
      })

      const response = await fetch(url, {
        method: "PATCH",
        headers: postHeaders,
        body,
      })

      if (response.ok) {
        refetch()
        onClose()
        toast.success("Les modifications ont été enregistrées avec succès !")
      } else {
        throw new Error("Erreur lors de la mise à jour")
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error)
      toast.error("Une erreur est survenue lors de l'enregistrement")
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} hide={onClose}>
        <ModalTitle>Éditer la demande</ModalTitle>
        <ModalContent>
          <Row gutters className="fr-mb-1v">
            <Col md="6" xs="12">
              <div className="fr-select-group">
                <label htmlFor="fileTagInput" className="fr-label">
                  Fichier
                </label>
                <select
                  id="fileTagInput"
                  name="fileTag"
                  value={inputs.tags?.file || "none"}
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
                  value={inputs.tags?.code || "none"}
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
                  value={inputs.tags?.index || "none"}
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
                  value={inputs.tags?.notification || "none"}
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
        </ModalContent>
        <ModalFooter style={{ display: "flex", width: "100%", alignItems: "center" }}>
          <div style={{ flexGrow: 1 }}>
            <Button variant="secondary" onClick={onClose}>
              Annuler
            </Button>
          </div>
          <Button variant="primary" onClick={handleSubmit}>
            Enregistrer
          </Button>
        </ModalFooter>
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
