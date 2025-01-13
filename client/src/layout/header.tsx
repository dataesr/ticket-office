import { useEffect, useState } from "react";
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
import {
  contactUrl,
  contributionUrl,
  productionUrl,
  nameChangeUrl,
  removeUserUrl,
} from "../config/api";

const Header: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const { pathname } = useLocation();

  const urls = [
    {
      url: contributionUrl,
      name: "Contribution par objet",
      href: "/scanr-contributionPage",
    },
    {
      url: contactUrl,
      name: "Formulaire de contact",
      href: "/scanr-contact",
    },
    {
      url: productionUrl,
      name: "Lier des publications",
      href: "/scanr-apioperations",
    },
    {
      url: removeUserUrl,
      name: "Supprimer des personnes de la base de données",
      href: "/scanr-removeuser",
    },
    {
      url: nameChangeUrl,
      name: "Changer le nom d'une personne",
      href: "/scanr-namechange",
    },
  ];

  const handleButtonClick = () => setShowModal(true);

  const handleProfileSelect = (profile: string) => {
    setSelectedProfile(profile);
    localStorage.setItem("selectedProfile", profile);
    setShowModal(false);
  };

  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    const profileFromStorage = localStorage.getItem("selectedProfile");
    if (profileFromStorage) {
      setSelectedProfile(profileFromStorage);
    }
  }, []);

  return (
    <>
      <HeaderWrapper>
        <Logo
          splitCharacter="|"
          text="Ministère|chargé|de l'enseignement|supérieur|et de la recherche"
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
            {selectedProfile ? `Salut ${selectedProfile} !` : "Mon profil"}
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
          <NavItem
            current={pathname.split("/").includes("scanr")}
            title={"scanR"}
          >
            {urls.map(({ href, name }) => {
              return (
                <Link
                  key={href}
                  current={pathname.startsWith("/scanr")}
                  href={href}
                >
                  {name}
                </Link>
              );
            })}
          </NavItem>
          <Link
            current={pathname.startsWith("/paysage")}
            href="/paysage-contact"
          >
            Paysage
          </Link>
          <Link
            current={pathname.startsWith("/curiexplore")}
            href="/curiexplore-contact"
          >
            CurieXplore
          </Link>
          <NavItem current={pathname.split("/").includes("bso")} title={"BSO"}>
            <Link current={pathname.startsWith("/bso")} href="/bso-contact">
              Formulaire de contact
            </Link>
            <Link current={pathname.startsWith("/bso")} href="/bso-local">
              Demandes de BSO local
            </Link>
          </NavItem>
          <Link
            current={pathname.startsWith("/datasupr")}
            href="/datasupr-contact"
          >
            datasupR
          </Link>
          <Link
            current={pathname.startsWith("/works-magnet")}
            href="/works-magnet-contact"
          >
            Works magnet
          </Link>
          <Link
            current={pathname.startsWith("/last-mails-sent")}
            href="/last-mails-sent"
          >
            Dernier mails envoyés
          </Link>
          <Link
            current={pathname.startsWith("/statistiques")}
            href="/statistiques"
          >
            Les stats
          </Link>
        </Nav>
      </HeaderWrapper>
    </>
  );
};

export default Header;
