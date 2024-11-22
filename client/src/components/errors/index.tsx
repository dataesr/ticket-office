import { Notice } from "@dataesr/dsfr-plus";

export default function Error404({ error }: { error?: unknown }) {
  return (
    <div className="fr-container">
      <div className="fr-my-7w fr-mt-md-12w fr-mb-md-10w fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-grid-row--center">
        <div className="fr-py-0 fr-col-12 fr-col-md-6">
          <h1>Erreur !</h1>
          <p className="fr-text--sm fr-mb-3w">Code 404</p>
          <p className="fr-text--sm fr-mb-5w">
            Cette page n'existe pas !<br />
            <br />
          </p>
          <ul className="fr-btns-group fr-btns-group--inline-md">
            <li>
              <a className="fr-btn" href="/">
                Vers l'accueil
              </a>
            </li>
          </ul>
          {error && (
            <Notice className="fr-my-5w" type="error" closeMode="disallow">
              <pre>
                <code>{JSON.stringify(error, null, 2)}</code>
              </pre>
            </Notice>
          )}
        </div>
        <div className="fr-col-12 fr-col-md-3 fr-col-offset-md-1 fr-px-6w fr-px-md-0 fr-py-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="fr-responsive-img fr-artwork"
            aria-hidden="true"
            width="160"
            height="200"
            viewBox="0 0 160 200"
          >
            <use
              className="fr-artwork-motif"
              href="/artwork/pictograms/system/ovoid.svg#artwork-motif"
            />
            <use
              className="fr-artwork-background"
              href="/artwork/pictograms/system/ovoid.svg#artwork-background"
            />
            <g transform="translate(40, 60)">
              <use
                className="fr-artwork-decorative"
                href="/artwork/pictograms/system/technical-error.svg#artwork-decorative"
              />
              <use
                className="fr-artwork-minor"
                href="/artwork/pictograms/system/technical-error.svg#artwork-minor"
              />
              <use
                className="fr-artwork-major"
                href="/artwork/pictograms/system/technical-error.svg#artwork-major"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
