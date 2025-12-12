import { useState } from "react";
import { Container, Title, DismissibleTag } from "@dataesr/dsfr-plus";
import {
  useMatomoStats,
  useMatomoTopPages,
  useMatomoReferrers,
  useMatomoDevices,
  useMatomoOS,
  useMatomoEvolution,
  useMatomoRegions,
  useMatomoCities,
} from "./api";
import { MATOMO_SITES } from "../../config/matomo-sites";
import StatsFilters from "./StatsFilters";
import StatsCards from "./StatsCards";
import StatsChart from "./StatsChart";
import TopPagesTable from "./TopPagesTable";
import StatsLists from "./StatsLists";
import "./styles.scss";

const GetStats = () => {
  const [site, setSite] = useState<string>("scanr-prod");
  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">(
    "day"
  );
  const [dateInput, setDateInput] = useState("today");
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [customDate, setCustomDate] = useState("");

  const date =
    useCustomDate && customDate ? `${customDate},${customDate}` : dateInput;
  const effectivePeriod =
    ["last7", "last30"].includes(dateInput) || (useCustomDate && customDate)
      ? "range"
      : period;

  const {
    data: stats,
    isLoading,
    error,
  } = useMatomoStats({ site, period: effectivePeriod, date });
  const { data: topPages } = useMatomoTopPages({
    site,
    period: effectivePeriod,
    date,
  });
  const { data: referrers } = useMatomoReferrers({
    site,
    period: effectivePeriod,
    date,
  });
  const { data: devices } = useMatomoDevices({
    site,
    period: effectivePeriod,
    date,
  });
  const { data: osFamilies } = useMatomoOS({
    site,
    period: effectivePeriod,
    date,
  });
  const { data: evolutionData } = useMatomoEvolution({
    site,
    period: "day",
    date: "last30",
  });
  const { data: regions } = useMatomoRegions({
    site,
    period: effectivePeriod,
    date,
  });
  const { data: cities } = useMatomoCities({
    site,
    period: effectivePeriod,
    date,
  });

  const handleQuickDate = (value: string) => {
    setDateInput(value);
    setUseCustomDate(false);
    setCustomDate("");
    if (value === "today") {
      setPeriod("day");
    }
  };

  const handleCustomDateChange = (value: string) => {
    setCustomDate(value);
    setUseCustomDate(true);
  };

  const isQuickActive = (key: string) => {
    if (useCustomDate) return false;
    if (["last7", "last30"].includes(key)) {
      return dateInput === key && effectivePeriod === "range";
    }
    return dateInput === key && effectivePeriod === "day";
  };

  const currentSiteName =
    MATOMO_SITES[site as keyof typeof MATOMO_SITES]?.name || "Site";

  return (
    <Container className="fr-mt-5w">
      <div className="stats-header">
        <Title look="h3">Statistiques de {currentSiteName}</Title>
      </div>

      <StatsFilters
        site={site}
        setSite={setSite}
        period={period}
        setPeriod={setPeriod}
        customDate={customDate}
        handleCustomDateChange={handleCustomDateChange}
        handleQuickDate={handleQuickDate}
        isQuickActive={isQuickActive}
      />

      {isLoading && (
        <div className="fr-callout fr-callout--info fr-mt-3w">
          <p className="fr-callout__text">Chargement des données...</p>
        </div>
      )}

      {error && (
        <div className="fr-callout fr-callout--error fr-mt-3w">
          <h3 className="fr-callout__title">Erreur</h3>
          <p className="fr-callout__text">{error.message}</p>
        </div>
      )}

      {stats && !isLoading && !error && (
        <div>
          {((useCustomDate && customDate) || dateInput !== "today") && (
            <div className="fr-mb-3w">
              <DismissibleTag
                size="sm"
                onClick={() => handleQuickDate("today")}
              >
                📅{" "}
                {useCustomDate && customDate
                  ? new Date(customDate).toLocaleDateString("fr-FR")
                  : dateInput === "yesterday"
                  ? "Hier"
                  : dateInput === "last7"
                  ? "7 derniers jours"
                  : dateInput === "last30"
                  ? "30 derniers jours"
                  : dateInput}
              </DismissibleTag>
            </div>
          )}

          <StatsCards stats={stats} />

          {evolutionData && <StatsChart evolutionData={evolutionData} />}

          <TopPagesTable topPages={topPages || []} />

          <StatsLists
            referrers={referrers}
            devices={devices}
            osFamilies={osFamilies}
            regions={regions}
            cities={cities}
          />
        </div>
      )}
    </Container>
  );
};

export default GetStats;
