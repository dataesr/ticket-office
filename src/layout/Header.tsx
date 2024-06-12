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
  NavItem,
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
                  animation: "blink 2s steps(5, start) infinite",
                  backgroundColor: "#000091",
                  color: "#e1000f",
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
        <NavItem
          current={pathname.split("/").includes("search")}
          title={"Opérations sur l'API"}
        >
          <Link
            current={pathname.startsWith("/apioperations")}
            href="/apioperations"
          >
            Lier des publications
          </Link>
          <Link current={pathname.startsWith("/delete")} href="/delete">
            Supprimer des personnes de la base de donnée
          </Link>
          <Link current={pathname.startsWith("/namechange")} href="/namechange">
            Changer le nom d'une personne
          </Link>
        </NavItem>
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;
