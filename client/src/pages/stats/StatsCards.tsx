import { Row, Col } from "@dataesr/dsfr-plus";
import { formatDuration, formatNumber } from "./utils";

interface MatomoStats {
  nb_uniq_visitors?: number;
  nb_visits: number;
  nb_actions: number;
  avg_time_on_site: number;
  bounce_rate: string;
  nb_actions_per_visit: number;
}

interface StatsCardsProps {
  stats: MatomoStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <>
      <Row gutters>
        {Number(stats.nb_uniq_visitors) > 0 && (
          <Col xs="12" md="6" lg="3">
            <div className="stat-card stat-card--primary">
              <div className="stat-card__icon">👥</div>
              <div className="stat-card__content">
                <div className="stat-card__label">Visiteurs uniques</div>
                <div className="stat-card__value">
                  {stats.nb_uniq_visitors
                    ? formatNumber(stats.nb_uniq_visitors)
                    : "N/A"}
                </div>
              </div>
            </div>
          </Col>
        )}

        {Number(stats.nb_visits) > 0 && (
          <Col xs="12" md="6" lg="3">
            <div className="stat-card stat-card--success">
              <div className="stat-card__icon">🔄</div>
              <div className="stat-card__content">
                <div className="stat-card__label">Visites</div>
                <div className="stat-card__value">
                  {formatNumber(stats.nb_visits)}
                </div>
              </div>
            </div>
          </Col>
        )}

        {Number(stats.nb_actions) > 0 &&
          Number.isFinite(stats.nb_actions / (stats.nb_visits || 1)) && (
            <Col xs="12" md="6" lg="3">
              <div className="stat-card stat-card--info">
                <div className="stat-card__icon">📄</div>
                <div className="stat-card__content">
                  <div className="stat-card__label">Pages vues</div>
                  <div className="stat-card__value">
                    {formatNumber(stats.nb_actions)}
                  </div>
                  {stats.nb_visits > 0 &&
                    Number.isFinite(stats.nb_actions / stats.nb_visits) && (
                      <div className="stat-card__meta">
                        {(stats.nb_actions / stats.nb_visits).toFixed(1)} par
                        visite
                      </div>
                    )}
                </div>
              </div>
            </Col>
          )}

        <Col xs="12" md="6" lg="3">
          <div className="stat-card stat-card--warning">
            <div className="stat-card__icon">⏱️</div>
            <div className="stat-card__content">
              <div className="stat-card__label">Durée moyenne</div>
              <div className="stat-card__value">
                {formatDuration(stats.avg_time_on_site)}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutters className="fr-mt-3w">
        <Col xs="12" md="6">
          <div className="stat-card stat-card--secondary">
            <div className="stat-card__content">
              <div className="stat-card__label">Taux de rebond</div>
              <div className="stat-card__value stat-card__value--large">
                {stats.bounce_rate}
              </div>
              <div className="stat-card__description">
                Pourcentage de visites d'une seule page
              </div>
            </div>
          </div>
        </Col>
        {Number(stats.nb_actions_per_visit) > 0 &&
          Number.isFinite(stats.nb_actions_per_visit) && (
            <Col xs="12" md="6">
              <div className="stat-card stat-card--secondary">
                <div className="stat-card__content">
                  <div className="stat-card__label">Actions par visite</div>
                  <div className="stat-card__value stat-card__value--large">
                    {stats.nb_actions_per_visit.toFixed(1)}
                  </div>
                  <div className="stat-card__description">
                    Nombre moyen d'actions par visite
                  </div>
                </div>
              </div>
            </Col>
          )}
      </Row>
    </>
  );
};

export default StatsCards;
