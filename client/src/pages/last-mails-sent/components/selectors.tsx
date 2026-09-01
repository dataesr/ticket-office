import "./styles.scss";

type Option = { value: string; label: string };

type MailFiltersProps = {
  profile: string;
  profiles: string[];
  onProfile: (value: string) => void;
  objectType: string;
  objectTypes: Option[];
  onObjectType: (value: string) => void;
  application: string;
  applications: string[];
  onApplication: (value: string) => void;
  dateFrom: string;
  onDateFrom: (value: string) => void;
  dateTo: string;
  onDateTo: (value: string) => void;
};

const MailFilters: React.FC<MailFiltersProps> = ({
  profile,
  profiles,
  onProfile,
  objectType,
  objectTypes,
  onObjectType,
  application,
  applications,
  onApplication,
  dateFrom,
  onDateFrom,
  dateTo,
  onDateTo,
}) => {
  return (
    <div className="mails-filter-bar">
      <div className="fr-select-group fr-mb-0">
        <label className="fr-label fr-sr-only" htmlFor="mails-object-type">
          Type d'objet
        </label>
        <select
          id="mails-object-type"
          className="fr-select"
          value={objectType}
          onChange={(e) => onObjectType(e.target.value)}
        >
          <option value="all">Tous les types</option>
          {objectTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="fr-select-group fr-mb-0">
        <label className="fr-label fr-sr-only" htmlFor="mails-application">
          Application
        </label>
        <select
          id="mails-application"
          className="fr-select"
          value={application}
          onChange={(e) => onApplication(e.target.value)}
        >
          <option value="all">Toutes les applications</option>
          {applications.map((app) => (
            <option key={app} value={app}>
              {app}
            </option>
          ))}
        </select>
      </div>

      <div className="fr-select-group fr-mb-0">
        <label className="fr-label fr-sr-only" htmlFor="mails-profile">
          Profil
        </label>
        <select
          id="mails-profile"
          className="fr-select"
          value={profile}
          onChange={(e) => onProfile(e.target.value)}
        >
          <option value="all">Tout le monde</option>
          {profiles.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="fr-input-group fr-mb-0 mails-filter-bar__date">
        <label className="fr-label fr-text--xs" htmlFor="mails-date-from">
          Du
        </label>
        <input
          id="mails-date-from"
          type="date"
          className="fr-input"
          value={dateFrom}
          max={dateTo || undefined}
          onChange={(e) => onDateFrom(e.target.value)}
        />
      </div>

      <div className="fr-input-group fr-mb-0 mails-filter-bar__date">
        <label className="fr-label fr-text--xs" htmlFor="mails-date-to">
          Au
        </label>
        <input
          id="mails-date-to"
          type="date"
          className="fr-input"
          value={dateTo}
          min={dateFrom || undefined}
          onChange={(e) => onDateTo(e.target.value)}
        />
      </div>
    </div>
  );
};

export default MailFilters;
