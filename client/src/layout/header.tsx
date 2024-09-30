import { useState } from "react";
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
  Text,
  Col,
} from "@dataesr/dsfr-plus";
import ProfileModal from "../components/profil-modal";
import LatestMails from "../components/last-mail/lasts-mails-sent";
import ContributionData from "../api/contribution-api/getData";
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

  const contributionsData = urls.map(({ url }) => ContributionData(url));

  const handleButtonClick = () => setShowModal(true);

  const handleProfileSelect = (profile: string) => {
    setSelectedProfile(profile);
    setShowModal(false);
  };

  const handleCloseModal = () => setShowModal(false);

  const countNewContributions = (data, appName) => {
    if (!data || !data.data) return 0;

    const filterByAppName = appName
      ? (contribution) => contribution.fromApplication === appName
      : () => true;

    return data.data.filter(
      (contribution) =>
        filterByAppName(contribution) && contribution.status === "new"
    ).length;
  };

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
          <NavItem
            current={pathname.split("/").includes("scanr")}
            title={"scanR"}
          >
            {urls.map(({ href, name }, index) => {
              const { data, isLoading, isError } = contributionsData[index];
              const appName = href === "/scanr-contact" ? "scanr" : null;

              return (
                <Link
                  key={href}
                  current={pathname.startsWith("/scanr")}
                  href={href}
                >
                  {name}{" "}
                  {isLoading
                    ? "(Chargement...)"
                    : !isError && data
                    ? `(${countNewContributions(data, appName)})`
                    : ""}
                </Link>
              );
            })}
          </NavItem>
          <Link
            current={pathname.startsWith("/paysage")}
            href="/paysage-contact"
          >
            Paysage{" "}
            {!contributionsData[1].isLoading &&
            countNewContributions(contributionsData[1].data, "paysage") > 0
              ? `(${countNewContributions(
                  contributionsData[1].data,
                  "paysage"
                )})`
              : ""}
          </Link>
          <Link
            current={pathname.startsWith("/curiexplore")}
            href="/curiexplore-contact"
          >
            CurieXplore{" "}
            {!contributionsData[1].isLoading &&
            countNewContributions(contributionsData[1].data, "curiexplore") > 0
              ? `(${countNewContributions(
                  contributionsData[1].data,
                  "curiexplore"
                )})`
              : ""}
          </Link>
          <NavItem current={pathname.split("/").includes("bso")} title={"BSO"}>
            <Link current={pathname.startsWith("/bso")} href="/bso-contact">
              Formulaire de contact{" "}
              {!contributionsData[1].isLoading &&
              countNewContributions(contributionsData[1].data, "bso") > 0
                ? `(${countNewContributions(contributionsData[1].data, "bso")})`
                : ""}
            </Link>
            <Link current={pathname.startsWith("/bso")} href="/bso-local">
              Demandes de BSO local
            </Link>
          </NavItem>
          <Link
            current={pathname.startsWith("/datasupr")}
            href="/datasupr-contact"
          >
            datasupR{" "}
            {!contributionsData[1].isLoading &&
            countNewContributions(contributionsData[1].data, "datasupr") > 0
              ? `(${countNewContributions(
                  contributionsData[1].data,
                  "datasupr"
                )})`
              : ""}
          </Link>
          <Link
            current={pathname.startsWith("/works-magnet")}
            href="/works-magnet-contact"
          >
            Works magnet{" "}
            {!contributionsData[1].isLoading &&
            countNewContributions(contributionsData[1].data, "works-magnet") > 0
              ? `(${countNewContributions(
                  contributionsData[1].data,
                  "works-magnet"
                )})`
              : ""}
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
    </>
  );
};

export default Header;
