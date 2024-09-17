import { Modal, ModalTitle, ModalContent } from "@dataesr/dsfr-plus";
import "./styles.scss";
import profiles from "../../config/profil-config.json";
import { ProfileModalProps } from "../../types";

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onSelectProfile,
}) => {
  return (
    <Modal isOpen={isOpen} hide={onClose}>
      <ModalTitle>Hello ! Selectionne ton profil</ModalTitle>
      <ModalContent className="profile-modal-content">
        <div className="profile-buttons">
          {profiles.map((profile, index) => (
            <button
              key={index}
              className={`profile-button profile${index + 1}`}
              onClick={() => onSelectProfile(profile)}
            >
              {profile}
            </button>
          ))}
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ProfileModal;
