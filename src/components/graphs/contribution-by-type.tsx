import { Col } from "@dataesr/dsfr-plus";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { ClipLoader } from "react-spinners";

const ContributionsGraphByYearAndType = ({
  contributions,
  isLoading,
  isError,
}) => {
  if (isLoading) {
    return (
      <Col className="comment">
        <ClipLoader color="#123abc" size={50} />
      </Col>
    );
  }

  if (isError) {
    return <div>Une erreur s'est produite</div>;
  }

  if (!Array.isArray(contributions)) {
    return <div>Les données ne sont pas disponibles</div>;
  }

  const contributionsByYearAndType = contributions.reduce(
    (acc, contribution) => {
      const date = new Date(contribution.created_at);
      const year = date.getFullYear();
      const type = contribution.type;

      if (!acc[year]) {
        acc[year] = {};
      }

      if (!acc[year][type]) {
        acc[year][type] = 0;
      }

      acc[year][type]++;

      return acc;
    },
    {}
  );

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: `Nombre de contributions par année et par type`,
    },
    xAxis: {
      categories: Object.keys(contributionsByYearAndType),
    },
    series: Object.entries(contributionsByYearAndType).reduce(
      (acc, [, contributions]) => {
        Object.entries(contributions).forEach(([type, count]) => {
          const series = acc.find((series) => series.name === type);

          if (series) {
            series.data.push(count);
          } else {
            acc.push({
              name: type,
              data: [count],
            });
          }
        });

        return acc;
      },
      []
    ),
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ContributionsGraphByYearAndType;
