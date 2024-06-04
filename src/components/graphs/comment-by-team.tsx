import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Col, SegmentedControl, SegmentedElement } from "@dataesr/dsfr-plus";
import { ClipLoader } from "react-spinners";

const CommentsGraphByTeamMember = ({
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

  const counts = contributions.reduce((acc, curr) => {
    if (curr.comment && curr.team) {
      acc[curr.team] = (acc[curr.team] || 0) + 1;
    }
    return acc;
  }, {} as { [key: string]: number });

  const chartData = Object.entries(counts).map(([name, y]) => ({
    name,
    y,
  }));

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "Nombre de commentaires par membre de l'équipe",
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      title: {
        text: "Nombre de commentaires",
      },
    },
    series: [
      {
        name: "Membre de l'équipe",
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

export default CommentsGraphByTeamMember;
