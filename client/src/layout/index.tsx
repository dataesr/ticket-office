import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  Button,
  Container,
  FastAccess,
  Header,
  Link,
  Logo,
  Nav,
  NavItem,
  Service,
  Skiplinks,
} from "@dataesr/dsfr-plus";

import { version } from "../../../package.json";
import {
  Footer,
  FooterBody,
  FooterBottom,
  FooterTop,
} from "../components/footer";
import ProfileModal from "../components/profil-modal";
import SwitchTheme from "./switch-theme";

const { VITE_HEADER_TAG } = import.meta.env;

export default function Layout() {
  const { pathname } = useLocation();
  const [profile, setProfile] = useState(
    localStorage.getItem("selectedProfile")
  );
  const [showProfileModal, setShowProfileModal] = useState(!profile);

  const selectProfile = (name: string) => {
    localStorage.setItem("selectedProfile", name);
    setProfile(name);
    setShowProfileModal(false);
  };

  const navLink = (href: string, label: string) => (
    <Link href={href} aria-current={pathname === href ? "page" : undefined}>
      {label}
    </Link>
  );

  return (
    <>
      <Skiplinks
        links={[
          { href: "#content", label: "Contenu" },
          { href: "#navigation", label: "Menu" },
          { href: "#footer", label: "Pied de page" },
        ]}
      />
      <Header>
        <Logo
          splitCharacter="|"
          text={`Ministère|de l'enseignement|supérieur,|de la recherche|et de l'espace -- ${VITE_HEADER_TAG}`}
        />
        <Service
          name="Guichet Numérique"
          tagline="Traitement des contributions scanR, BSO et Tableaux"
        />
        <FastAccess>
          <Button icon="account-line" onClick={() => setShowProfileModal(true)}>
            {profile ? `Salut ${profile} !` : "Mon profil"}
          </Button>
        </FastAccess>
        <Nav id="navigation">
          {navLink("/", "Accueil")}
          <NavItem title="scanR" current={pathname.startsWith("/scanr")}>
            {navLink("/scanr-contributionPage", "Contribution par objet")}
            {navLink("/scanr-contact", "Formulaire de contact")}
            {navLink("/scanr-apioperations", "Lier des publications")}
            {navLink("/scanr-removeuser", "Supprimer des personnes de la base de données")}
            {navLink("/scanr-namechange", "Changer le nom d'une personne")}
          </NavItem>
          <NavItem
            title="BSO"
            current={pathname.startsWith("/bso-local-variations")}
          >
            {navLink("/bso-local-variations-publications", "Demandes de déclinaisons locales - Publications")}
            {navLink("/bso-local-variations-datasets", "Demandes de déclinaisons locales - Jeux de données")}
          </NavItem>
          {navLink("/tableaux-contact", "Tableaux")}
          {navLink("/last-mails-sent", "Derniers mails envoyés")}
          {navLink("/last-mails-received", "Derniers mails reçus")}
          {navLink("/statistiques", "Les stats")}
          {navLink("/certificats", "Les Certificats")}
        </Nav>
      </Header>
      <ProfileModal
        isOpen={showProfileModal}
        selectedProfile={profile}
        onClose={() => setShowProfileModal(false)}
        onSelectProfile={selectProfile}
      />
      <Outlet />
      <Footer fluid={true}>
        <FooterTop>
          <Container>Le Guichet Numérique du DISD</Container>
        </FooterTop>
        <FooterBody>
          <Logo
            splitCharacter="|"
            text="Ministère|de l'enseignement|supérieur|de la recherche et de l'espace"
          />
          <Link
            className="fr-footer__content-link"
            target="_blank"
            rel="noreferrer noopener external"
            title="[À MODIFIER - Intitulé] - nouvelle fenêtre"
            href="https://legifrance.gouv.fr"
          >
            legifrance.gouv.fr
          </Link>
          <Link
            className="fr-footer__content-link"
            target="_blank"
            rel="noreferrer noopener external"
            title="[À MODIFIER - Intitulé] - nouvelle fenêtre"
            href="https://gouvernement.fr"
          >
            gouvernement.fr
          </Link>
          <Link
            className="fr-footer__content-link"
            target="_blank"
            rel="noreferrer noopener external"
            title="[À MODIFIER - Intitulé] - nouvelle fenêtre"
            href="https://service-public.fr"
          >
            service-public.fr
          </Link>
          <Link
            className="fr-footer__content-link"
            target="_blank"
            rel="noreferrer noopener external"
            title="[À MODIFIER - Intitulé] - nouvelle fenêtre"
            href="https://data.gouv.fr"
          >
            data.gouv.fr
          </Link>
        </FooterBody>
        <FooterBottom>
          <button
            aria-controls="fr-theme-modal"
            className="fr-footer__bottom-link fr-icon-theme-fill fr-btn--icon-left"
            data-fr-opened="false"
          >
            Paramètres d'affichage
          </button>
          <a
            className="fr-footer__bottom-link"
            href={`https://github.com/dataesr/ticket-office/releases/tag/v${version}`}
            target="_blank"
          >
            Version de l'application {version}
          </a>
        </FooterBottom>
        <SwitchTheme />
      </Footer>
    </>
  );
}
