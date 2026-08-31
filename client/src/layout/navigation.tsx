import { Link, useLocation } from "react-router-dom";

type NavItem = { href: string; name: string; icon?: string };
type NavMenu = { id: string; label: string; items: NavItem[] };

const SCANR_MENU: NavMenu = {
  id: "scanr-menu",
  label: "scanR",
  items: [
    { href: "/scanr-contributionPage", name: "Contribution par objet" },
    { href: "/scanr-contact", name: "Formulaire de contact" },
    { href: "/scanr-apioperations", name: "Lier des publications" },
    {
      href: "/scanr-removeuser",
      name: "Supprimer des personnes de la base de données",
    },
    { href: "/scanr-namechange", name: "Changer le nom d'une personne" },
  ],
};

const BSO_MENU: NavMenu = {
  id: "bso-menu",
  label: "BSO",
  items: [
    {
      href: "/bso-local-variations-publications",
      name: "Demandes de déclinaisons locales - Publications",
    },
    {
      href: "/bso-local-variations-datasets",
      name: "Demandes de déclinaisons locales - Jeux de données",
    },
  ],
};

const SIMPLE_LINKS: NavItem[] = [
  { href: "/tableaux-contact", name: "Tableaux" },
  { href: "/last-mails-sent", name: "Derniers mails envoyés" },
  {
    href: "/last-mails-received",
    name: "Derniers mails reçus",
  },
  { href: "/statistiques", name: "Les stats" },
  { href: "/certificats", name: "Les Certificats" },
];

const concealMenu = (id: string) => {
  const dsfr = window?.["dsfr"];
  const element = document.getElementById(id);
  if (dsfr && element) dsfr(element)?.collapse?.conceal();
};

type NavigationProps = { onNavigate?: () => void };

export default function Navigation({ onNavigate }: NavigationProps) {
  const { pathname } = useLocation();

  const isCurrent = (href: string) => pathname === href;
  const isMenuActive = (menu: NavMenu) =>
    menu.items.some((item) => isCurrent(item.href));

  const handleNavigate = () => onNavigate?.();

  const renderMenu = (menu: NavMenu) => (
    <li className="fr-nav__item">
      <button
        className="fr-nav__btn"
        aria-expanded="false"
        aria-controls={menu.id}
        aria-current={isMenuActive(menu) ? "true" : undefined}
      >
        {menu.label}
      </button>
      <div className="fr-collapse fr-menu" id={menu.id}>
        <ul className="fr-menu__list">
          {menu.items.map(({ href, name }) => (
            <li className="fr-nav__item" key={href}>
              <Link
                className="fr-nav__link"
                to={href}
                aria-current={isCurrent(href) ? "page" : undefined}
                onClick={() => {
                  concealMenu(menu.id);
                  handleNavigate();
                }}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );

  return (
    <nav className="fr-nav" role="navigation" aria-label="Menu principal">
      <ul className="fr-nav__list">
        <li className="fr-nav__item">
          <Link
            className="fr-nav__link"
            to="/"
            aria-current={isCurrent("/") ? "page" : undefined}
            onClick={handleNavigate}
          >
            Accueil
          </Link>
        </li>

        {renderMenu(SCANR_MENU)}
        {renderMenu(BSO_MENU)}

        {SIMPLE_LINKS.map(({ href, name, icon }) => (
          <li className="fr-nav__item" key={href}>
            <Link
              className="fr-nav__link"
              to={href}
              aria-current={isCurrent(href) ? "page" : undefined}
              onClick={handleNavigate}
            >
              {name}
              {icon && <span className={icon} aria-hidden="true" />}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
