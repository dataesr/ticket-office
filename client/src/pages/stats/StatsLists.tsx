import { Row, Col } from "@dataesr/dsfr-plus";
import { formatNumber, getDeviceIcon, getReferrerLabel } from "./utils";

interface Referrer {
  label: string;
  nb_visits: number;
  nb_uniq_visitors?: number;
}

interface Device {
  label: string;
  nb_visits: number;
  nb_actions: number;
}

interface OSFamily {
  label: string;
  nb_visits: number;
  nb_actions?: number;
}

interface Region {
  label: string;
  nb_visits: number;
  nb_uniq_visitors?: number;
}

interface City {
  label: string;
  nb_visits: number;
  nb_uniq_visitors?: number;
}

interface StatsListsProps {
  referrers?: Referrer[];
  devices?: Device[];
  osFamilies?: OSFamily[];
  regions?: Region[];
  cities?: City[];
}

const StatsLists = ({
  referrers,
  devices,
  osFamilies,
  regions,
  cities,
}: StatsListsProps) => {
  return (
    <>
      <Row gutters className="fr-mt-3w">
        {referrers && referrers.length > 0 && (
          <Col xs="12" md="6">
            <div className="stat-list">
              <h4 className="stat-list__title">
                🔗 Provenances des connexions
              </h4>
              <ul className="stat-list__items">
                {referrers.map((referrer, index) => (
                  <li key={index} className="stat-list__item">
                    <div className="stat-list__label">
                      {getReferrerLabel(referrer.label)}
                    </div>
                    <div className="stat-list__value">
                      {formatNumber(referrer.nb_visits)} visites
                      {referrer.nb_uniq_visitors && (
                        <span className="stat-list__meta">
                          {" "}
                          ({formatNumber(referrer.nb_uniq_visitors)} visiteurs)
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        )}
        {devices && devices.length > 0 && (
          <Col xs="12" md="6">
            <div className="stat-list">
              <h4 className="stat-list__title">📱 Types d'appareils</h4>
              <ul className="stat-list__items">
                {devices
                  .filter((d) => Number(d.nb_visits) > 0)
                  .map((device, index) => {
                    const hasActions =
                      Number(device.nb_actions) > 0 &&
                      Number.isFinite(Number(device.nb_actions));
                    return (
                      <li key={index} className="stat-list__item">
                        <div className="stat-list__label">
                          {getDeviceIcon(device.label)} {device.label}
                        </div>
                        <div className="stat-list__value">
                          {formatNumber(device.nb_visits)} visites
                          {hasActions && (
                            <span className="stat-list__meta">
                              {" "}
                              ({formatNumber(device.nb_actions)} actions)
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </Col>
        )}
      </Row>

      {osFamilies && osFamilies.length > 0 && (
        <Row gutters className="fr-mt-3w">
          <Col xs="12" md="6">
            <div className="stat-list">
              <h4 className="stat-list__title">💽 Systèmes d'exploitation</h4>
              <ul className="stat-list__items">
                {osFamilies
                  .filter((o) => Number(o.nb_visits) > 0)
                  .map((os, index) => (
                    <li key={index} className="stat-list__item">
                      <div className="stat-list__label">{os.label}</div>
                      <div className="stat-list__value">
                        {formatNumber(os.nb_visits)} visites
                        {Number(os.nb_actions) > 0 &&
                          Number.isFinite(Number(os.nb_actions)) && (
                            <span className="stat-list__meta">
                              {" "}
                              ({formatNumber(Number(os.nb_actions))} actions)
                            </span>
                          )}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </Col>
        </Row>
      )}

      <Row gutters className="fr-mt-3w">
        {regions && regions.length > 0 && (
          <Col xs="12" md="6">
            <div className="stat-list">
              <h4 className="stat-list__title">🌍 Régions</h4>
              <ul className="stat-list__items">
                {regions
                  .filter((r) => Number(r.nb_visits) > 0)
                  .map((region, index) => (
                    <li key={index} className="stat-list__item">
                      <div className="stat-list__label">{region.label}</div>
                      <div className="stat-list__value">
                        {formatNumber(region.nb_visits)} visites
                        {region.nb_uniq_visitors && (
                          <span className="stat-list__meta">
                            {" "}
                            ({formatNumber(region.nb_uniq_visitors)} visiteurs)
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </Col>
        )}

        {cities && cities.length > 0 && (
          <Col xs="12" md="6">
            <div className="stat-list">
              <h4 className="stat-list__title">🏙️ Villes</h4>
              <ul className="stat-list__items">
                {cities
                  .filter((c) => Number(c.nb_visits) > 0)
                  .map((city, index) => (
                    <li key={index} className="stat-list__item">
                      <div className="stat-list__label">{city.label}</div>
                      <div className="stat-list__value">
                        {formatNumber(city.nb_visits)} visites
                        {city.nb_uniq_visitors && (
                          <span className="stat-list__meta">
                            {" "}
                            ({formatNumber(city.nb_uniq_visitors)} visiteurs)
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </Col>
        )}
      </Row>
    </>
  );
};

export default StatsLists;
