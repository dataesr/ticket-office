import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProfileModal from "../components/profil-modal";
import Navigation from "./navigation";

const MENU_MODAL_ID = "modal-header-menu";
const MENU_BUTTON_ID = "button-header-menu";

const SERVICE_TITLE = "Guichet Numérique";
const SERVICE_TAGLINE = "Traitement des contributions scanR, BSO et Tableaux";

const LOGO_LINES = [
  "Ministère",
  "de l'enseignement",
  "supérieur,",
  "de la recherche",
  `et de l'espace -- ${import.meta.env.VITE_HEADER_TAG}`,
];

const concealMenuModal = () => {
  const dsfr = window?.["dsfr"];
  const element = document.getElementById(MENU_MODAL_ID);
  if (dsfr && element) dsfr(element)?.modal?.conceal();
};

const Header: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  useEffect(() => {
    const profileFromStorage = localStorage.getItem("selectedProfile");
    if (profileFromStorage) setSelectedProfile(profileFromStorage);
    else setShowModal(true);
  }, []);

  const handleProfileSelection = (profile: string) => {
    setSelectedProfile(profile);
    localStorage.setItem("selectedProfile", profile);
    setShowModal(false);
  };

  return (
    <header role="banner" className="fr-header">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
              <div className="fr-header__brand-top">
                <div className="fr-header__logo">
                  <p className="fr-logo">
                    {LOGO_LINES.map((line, index) => (
                      <span key={line}>
                        {index > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="fr-header__navbar">
                  <button
                    className="fr-btn--menu fr-btn"
                    data-fr-opened="false"
                    aria-controls={MENU_MODAL_ID}
                    aria-haspopup="menu"
                    id={MENU_BUTTON_ID}
                    title="Menu"
                  >
                    Menu
                  </button>
                </div>
              </div>
              <div className="fr-header__service">
                <Link to="/" title={`Accueil - ${SERVICE_TITLE}`}>
                  <p className="fr-header__service-title">{SERVICE_TITLE}</p>
                </Link>
                <p className="fr-header__service-tagline">{SERVICE_TAGLINE}</p>
              </div>
            </div>

            <div className="fr-header__tools">
              <div className="fr-header__tools-links">
                <ul className="fr-btns-group">
                  <li>
                    <button
                      type="button"
                      className="fr-btn fr-icon-account-line fr-btn--icon-left"
                      onClick={() => setShowModal(true)}
                    >
                      {selectedProfile
                        ? `Salut ${selectedProfile} !`
                        : "Mon profil"}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="fr-header__menu fr-modal"
        id={MENU_MODAL_ID}
        aria-labelledby={MENU_BUTTON_ID}
      >
        <div className="fr-container">
          <button
            className="fr-btn--close fr-btn"
            aria-controls={MENU_MODAL_ID}
            title="Fermer"
          >
            Fermer
          </button>
          <div className="fr-header__menu-links" />
          <Navigation onNavigate={concealMenuModal} />
        </div>
      </div>

      <ProfileModal
        isOpen={showModal}
        selectedProfile={selectedProfile}
        onClose={() => setShowModal(false)}
        onSelectProfile={handleProfileSelection}
      />
    </header>
  );
};

export default Header;
