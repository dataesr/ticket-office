import { Modal, ModalTitle, ModalContent } from "@dataesr/dsfr-plus";
import "./styles.scss";
import profiles from "../../../profil-config.json"



type ProfileModalProps = {
  isOpen: boolean;
  selectedProfile: string | null;
  onClose: () => void;
  onSelectProfile: (profile: string) => void;
};

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  selectedProfile,
  onClose,
  onSelectProfile,
}) => {
  return (
    <Modal isOpen={isOpen} hide={onClose}>
      <ModalTitle>Hello {selectedProfile}!</ModalTitle>
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
