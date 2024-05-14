import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Header as HeaderWrapper,
  Logo,
  Service,
  Link,
  Nav,
  FastAccess,
  Button,
} from "@dataesr/dsfr-plus";
import ProfileModal from "../components/profil-modal";

const Header: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const savedProfile = sessionStorage.getItem("selectedProfile");
    if (savedProfile) {
      setSelectedProfile(savedProfile);
    }
  }, []);

  useEffect(() => {
    if (selectedProfile) {
      sessionStorage.setItem("selectedProfile", selectedProfile);
    }
  }, [selectedProfile]);

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const handleProfileSelect = (profile: string) => {
    setSelectedProfile(profile);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <HeaderWrapper>
      <Logo
        splitCharacter="|"
        text="Ministère|de l'enseignement|supérieur|et de la recherche"
      />
      <Service
        name="Le Guichet numérique"
        tagline={import.meta.env.VITE_HEADER_TAG}
      />
      <FastAccess>
        <Button
          data-fr-opened="false"
          aria-controls="modal-4"
          onClick={handleButtonClick}
          style={
            selectedProfile
              ? {}
              : {
                  animation: "blink 1s steps(5, start) infinite",
                  backgroundColor: "#6a6af4",
                  color: "#f95c5e",
                }
          }
        >
          {selectedProfile
            ? `Salut ${selectedProfile} !`
            : "Selectionnez un profil"}
        </Button>
        <ProfileModal
          isOpen={showModal}
          selectedProfile={selectedProfile}
          onClose={handleCloseModal}
          onSelectProfile={handleProfileSelect}
        />
      </FastAccess>
      <Nav>
        <Link current={pathname === "/"} href="/">
          Accueil
        </Link>
        <Link
          current={pathname.startsWith("/contributionpage")}
          href="/contributionpage"
        >
          Contributions par objets
        </Link>
        <Link current={pathname.startsWith("/contact")} href="/contact">
          Contributions via formulaire de contact
        </Link>
        <Link
          current={pathname.startsWith("/apioperations")}
          href="/apioperations"
        >
          Opérations sur l'API
        </Link>
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;
