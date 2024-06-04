import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

import { Col, SegmentedControl, SegmentedElement } from "@dataesr/dsfr-plus";
import { ContributionDataType } from "../../types";
import { ClipLoader } from "react-spinners";

const AdminTreatmentGraph = ({
  contributions,
  isLoading,
  isError,
  filter,
  setFilter,
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

  const responsesByAdmin = contributions.reduce(
    (acc: Record<string, number>, contribution: ContributionDataType) => {
      if (contribution.team) {
        contribution.team.forEach((admin: string) => {
          if (!acc[admin]) {
            acc[admin] = 1;
          } else {
            acc[admin] += 1;
          }
        });
      }

      return acc;
    },
    {}
  );

  const chartData = Object.entries(responsesByAdmin)
    .map(([name, y]) => ({ name, y }))
    .sort((a: any, b: any) => b.y - a.y);

  const options = {
    chart: {
      type: "column",
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 50,
        viewDistance: 25,
      },
    },
    title: {
      text: "Traitements par admin",
    },
    plotOptions: {
      column: {
        depth: 25,
        dataLabels: {
          enabled: true,
          format: function () {
            if (this.point.index === 0) {
              return '<i class="fr-icon-building-line"></i>';
            }
            return "";
          },
          useHTML: true,
        },
      },
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      title: {
        text: "Nombre de traitement",
      },
    },
    series: [
      {
        name: "Traitements",
        data: chartData,
      },
    ],
  };

  return (
    <>
      <SegmentedControl name={""} className="fr-mb-5w">
        <SegmentedElement
          onClick={() => setFilter("object")}
          name="Par Objet"
          label={"Par Objet"}
          value={""}
          icon="fr-fi-eye-line"
          checked={filter === "object"}
        />
        <SegmentedElement
          onClick={() => setFilter("contact")}
          name="Par Objet"
          label={"Via formulaire contact"}
          value={""}
          checked={filter === "contact"}
        />
      </SegmentedControl>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
};

export default AdminTreatmentGraph;
