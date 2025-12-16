import { Row, Col } from "@dataesr/dsfr-plus";
import { MATOMO_SITES } from "../../config/matomo-sites";

interface StatsFiltersProps {
  site: string;
  setSite: (site: string) => void;
  period: "day" | "week" | "month" | "year";
  setPeriod: (period: "day" | "week" | "month" | "year") => void;
  customDate: string;
  handleCustomDateChange: (value: string) => void;
  handleQuickDate: (value: string) => void;
  isQuickActive: (key: string) => boolean;
}

const StatsFilters = ({
  site,
  setSite,
  period,
  setPeriod,
  customDate,
  handleCustomDateChange,
  handleQuickDate,
  isQuickActive,
}: StatsFiltersProps) => {
  return (
    <div className="stats-filters">
      <Row gutters>
        <Col xs="12" sm="6" md="5">
          <div className="filter-group">
            <label htmlFor="site-select" className="fr-label">
              Application
            </label>
            <select
              id="site-select"
              className="fr-select"
              value={site}
              onChange={(e) => setSite(e.target.value)}
            >
              {Object.entries(MATOMO_SITES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.name}
                </option>
              ))}
            </select>
          </div>
        </Col>
        <Col xs="12" sm="6" md="6">
          <div className="filter-group">
            <label htmlFor="period-select" className="fr-label">
              Période
            </label>
            <select
              id="period-select"
              className="fr-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
            >
              <option value="day">Jour</option>
              <option value="week">Semaine</option>
              <option value="month">Mois</option>
              <option value="year">Année</option>
            </select>
          </div>
        </Col>
        <Col xs="12" sm="6" md="6">
          <div className="filter-group">
            <label htmlFor="custom-date" className="fr-label">
              Date
            </label>
            <input
              id="custom-date"
              type="date"
              className="fr-input"
              value={customDate}
              onChange={(e) => handleCustomDateChange(e.target.value)}
            />
          </div>
        </Col>
      </Row>
      <Row gutters className="fr-mt-2w">
        <Col xs="12">
          <div className="filter-group">
            <button
              type="button"
              className={`fr-btn fr-btn--sm fr-mr-1w ${
                isQuickActive("today") ? "fr-btn--primary" : "fr-btn--secondary"
              }`}
              onClick={() => handleQuickDate("today")}
            >
              Aujourd'hui
            </button>
            <button
              type="button"
              className={`fr-btn fr-btn--sm fr-mr-1w ${
                isQuickActive("yesterday")
                  ? "fr-btn--primary"
                  : "fr-btn--secondary"
              }`}
              onClick={() => handleQuickDate("yesterday")}
            >
              Hier
            </button>
            <button
              type="button"
              className={`fr-btn fr-btn--sm fr-mr-1w ${
                isQuickActive("last7") ? "fr-btn--primary" : "fr-btn--secondary"
              }`}
              onClick={() => handleQuickDate("last7")}
            >
              7 derniers jours
            </button>
            <button
              type="button"
              className={`fr-btn fr-btn--sm ${
                isQuickActive("last30")
                  ? "fr-btn--primary"
                  : "fr-btn--secondary"
              }`}
              onClick={() => handleQuickDate("last30")}
            >
              30 derniers jours
            </button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StatsFilters;
