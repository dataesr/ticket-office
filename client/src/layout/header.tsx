<<<<<<< HEAD
<<<<<<< HEAD
import { useState } from "react";
=======
import { useState, useEffect } from "react";
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
import { useState } from "react";
>>>>>>> 6c85106 (fix(header): add count of new contribution)
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
<<<<<<< HEAD
} from "@dataesr/dsfr-plus";
import ProfileModal from "../components/profil-modal";
import {
  contactUrl,
  contributionUrl,
  productionUrl,
  nameChangeUrl,
  removeUserUrl,
} from "../config/api";
=======
  Text,
  Col,
} from "@dataesr/dsfr-plus";
import ProfileModal from "../components/profil-modal";
import LatestMails from "../components/last-mail/lasts-mails-sent";
import ContributionData from "../api/contribution-api/getData";
<<<<<<< HEAD
import { contactUrl } from "../config/api";
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
import {
  contactUrl,
  contributionUrl,
  productionUrl,
  nameChangeUrl,
  removeUserUrl,
} from "../config/api";
>>>>>>> 6c85106 (fix(header): add count of new contribution)

const Header: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const { pathname } = useLocation();

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 6c85106 (fix(header): add count of new contribution)
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
<<<<<<< HEAD

  const handleButtonClick = () => setShowModal(true);
=======
  useEffect(() => {
    const savedProfile = localStorage.getItem("selectedProfile");
    if (savedProfile) {
      setSelectedProfile(savedProfile);
    }
  }, []);
=======
>>>>>>> 6c85106 (fix(header): add count of new contribution)

  const contributionsData = urls.map(({ url }) => ContributionData(url));

<<<<<<< HEAD
  const url = contactUrl;

  const { data, isLoading, isError, refetch } = ContributionData(url);
  const handleButtonClick = () => {
    setShowModal(true);
  };
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
  const handleButtonClick = () => setShowModal(true);
>>>>>>> 6c85106 (fix(header): add count of new contribution)

  const handleProfileSelect = (profile: string) => {
    setSelectedProfile(profile);
    setShowModal(false);
  };

<<<<<<< HEAD
<<<<<<< HEAD
  const handleCloseModal = () => setShowModal(false);
=======
  const handleCloseModal = () => {
    setShowModal(false);
=======
  const handleCloseModal = () => setShowModal(false);

<<<<<<< HEAD
  const countNewContributions = (data, appName) => {
    if (!data || !data.data) return 0;

    const filterByAppName = appName
      ? (contribution) => contribution.fromApplication === appName
      : () => true;

    return data.data.filter(
      (contribution) =>
        filterByAppName(contribution) && contribution.status === "new"
    ).length;
>>>>>>> 6c85106 (fix(header): add count of new contribution)
  };
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)

=======
>>>>>>> 03c66cc (fix(contribute_productions): update schemas)
  return (
    <>
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
<<<<<<< HEAD
<<<<<<< HEAD
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
        </Nav>
      </HeaderWrapper>
=======
          <Link
            current={pathname.startsWith("/contributionpage")}
            href="/contributionpage"
          >
            Contributions par objets
          </Link>
          <Link current={pathname.startsWith("/contact")} href="/contact">
            Contributions via formulaire de contact
          </Link>
=======
>>>>>>> 2b4b0b9 (feat(script): add new script to the scanr as fromApp and update nav in ui)
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
        </Nav>
      </HeaderWrapper>
      {!contributionsData.some(({ isLoading }) => isLoading) &&
      !contributionsData.some(({ isError }) => isError) &&
      contributionsData[0].data ? (
        <Col>
          <LatestMails
            data={contributionsData[0].data}
            refetch={contributionsData[0].refetch}
          />
        </Col>
      ) : (
        <Text>Chargement des mails...</Text>
      )}
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
    </>
  );
};

export default Header;
