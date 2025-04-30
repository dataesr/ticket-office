import { Button, Link } from "@dataesr/dsfr-plus";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import ProfileModal from "../components/profil-modal";
import {
  contactUrl,
  contributionUrl,
  nameChangeUrl,
  productionUrl,
  removeUserUrl,
  variationsDatasetsUrl,
  variationsPublicationsUrl,
} from "../config/api";

const concealElement = (id) => {
  const dsfr = window?.["dsfr"];
  if (dsfr) {
    const element = dsfr(document.getElementById(id));
    element?.collapse.conceal();
  }
};

const Header: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const { pathname } = useLocation();

  const urlsScanr = [
    {
      href: "/scanr-contributionPage",
      name: "Contribution par objet",
      url: contributionUrl,
    },
    {
      href: "/scanr-contact",
      name: "Formulaire de contact",
      url: contactUrl,
    },
    {
      href: "/scanr-apioperations",
      name: "Lier des publications",
      url: productionUrl,
    },
    {
      href: "/scanr-removeuser",
      name: "Supprimer des personnes de la base de données",
      url: removeUserUrl,
    },
    {
      href: "/scanr-namechange",
      name: "Changer le nom d'une personne",
      url: nameChangeUrl,
    },
  ];

  const urlsBso = [
    {
      href: "/bso-local-variations-publications",
      name: "Demandes de déclinaisons locales - Publications",
      url: variationsPublicationsUrl,
    },
    {
      href: "/bso-local-variations-datasets",
      name: "Demandes de déclinaisons locales - Jeux de données",
      url: variationsDatasetsUrl,
    },
  ];

  useEffect(() => {
    const profileFromStorage = localStorage.getItem("selectedProfile");
    if (profileFromStorage) {
      setSelectedProfile(profileFromStorage);
    } else setShowModal(true);
  }, []);

  const handleProfileSelection = (profile: string) => {
    setSelectedProfile(profile);
    localStorage.setItem("selectedProfile", profile);
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <header role="banner" className="fr-header">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__brand ">
            <div className="fr-header__body-row fr-enlarge-link">
              <div className="fr-header__brand-top">
                <div className="fr-header__logo">
                  <p className="fr-logo">
                    Le guichet numérique
                    <br />
                    DISD
                  </p>
                  <a href="/" title="Accueil"></a>
                  <p className="fr-header__service-tagline">
                    Le Guichet numérique {import.meta.env.VITE_HEADER_TAG}
                  </p>
                </div>
              </div>
            </div>
            <div className="fr-header__tools">
              <Button onClick={() => setShowModal(true)}>
                {selectedProfile ? `Salut ${selectedProfile} !` : "Mon profil"}
              </Button>
              <ProfileModal
                isOpen={showModal}
                selectedProfile={selectedProfile}
                onClose={handleClose}
                onSelectProfile={handleProfileSelection}
              />
            </div>
          </div>
          <nav className="fr-nav" role="navigation" aria-label="Menu principal">
            <ul className="fr-nav__list">
              <li className="fr-nav__item">
                <Link
                  className="fr-nav__link"
                  href="/"
                  aria-current={pathname === "/" ? "page" : undefined}
                >
                  Accueil
                </Link>
              </li>
              <li className="fr-nav__item">
                <button
                  className="fr-nav__btn"
                  aria-expanded="false"
                  aria-controls="scanr-menu"
                >
                  scanR
                </button>
                <div className="fr-collapse fr-menu" id="scanr-menu">
                  <ul className="fr-menu__list">
                    {urlsScanr.map(({ href, name }) => (
                      <li className="fr-nav__item" key={href}>
                        <Link
                          aria-current={pathname === href ? "page" : undefined}
                          className="fr-nav__link"
                          href={href}
                          onClick={() => concealElement("scanr-menu")}
                        >
                          {name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="fr-nav__item">
                <button
                  className="fr-nav__btn"
                  aria-expanded="false"
                  aria-controls="bso-menu"
                >
                  BSO
                </button>
                <div className="fr-collapse fr-menu" id="bso-menu">
                  <ul className="fr-menu__list">
                    {urlsBso.map(({ href, name }) => (
                      <li className="fr-nav__item" key={href}>
                        <Link
                          aria-current={pathname === href ? "page" : undefined}
                          className="fr-nav__link"
                          href={href}
                          onClick={() => concealElement("bso-menu")}
                        >
                          {name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="fr-nav__item">
                <Link
                  className="fr-nav__link"
                  href="/datasupr-contact"
                  aria-current={
                    pathname === "/datasupr-contact" ? "page" : undefined
                  }
                >
                  DatasupR
                </Link>
              </li>
              <li className="fr-nav__item">
                <Link
                  className="fr-nav__link"
                  href="/last-mails-sent"
                  aria-current={
                    pathname === "/last-mails-sent" ? "page" : undefined
                  }
                >
                  Derniers mails envoyés
                </Link>
              </li>
              <li className="fr-nav__item">
                <Link
                  className="fr-nav__link"
                  href="/last-mails-received"
                  aria-current={
                    pathname === "/last-mails-received" ? "page" : undefined
                  }
                >
                  Derniers mails reçus
                  <span className="fr-icon-medal-fill" aria-hidden="true" />
                </Link>
              </li>
              <li className="fr-nav__item">
                <Link
                  className="fr-nav__link"
                  href="/statistiques"
                  aria-current={
                    pathname === "/statistiques" ? "page" : undefined
                  }
                >
                  Les stats
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
