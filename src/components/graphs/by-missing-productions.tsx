import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import useGetContributionData from "../../api/contribution-api/useGetObjectContributeData";
import { Contribute_Production } from "../../types";
import { productionUrl } from "../../config/api";

const ContributionsGraphByStatus = () => {
  const { data, isLoading, isError } = useGetContributionData(productionUrl, 0);
  const contributions = (data as { data: Contribute_Production[] })?.data;

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (isError) {
    return <div>Une erreur s'est produite</div>;
  }

  if (!Array.isArray(contributions)) {
    return <div>Les données ne sont pas disponibles</div>;
  }

  const newCount = contributions.filter(
    (contribution) => contribution.status === "new"
  ).length;
  const ongoingCount = contributions.filter(
    (contribution) => contribution.status === "ongoing"
  ).length;
  const treatedCount = contributions.filter(
    (contribution) => contribution.status === "treated"
  ).length;

  const chartData = [
    { name: "New", y: newCount },
    { name: "Ongoing", y: ongoingCount },
    { name: "Treated", y: treatedCount },
  ];

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "Nombre de demande d'affiliation par statut",
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      title: {
        text: "Nombre de contributions",
      },
    },
    series: [
      {
        name: "Statut",
        data: chartData,
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ContributionsGraphByStatus;
