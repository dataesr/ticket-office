import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Col, SegmentedControl, SegmentedElement } from "@dataesr/dsfr-plus";
import { ClipLoader } from "react-spinners";

const ContributionsGraphByYear = ({
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

  const contributionsByMonth = (
    contributions as { created_at: string }[]
  ).reduce((acc, contribution) => {
    const date = new Date(contribution.created_at);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    if (!acc[year]) {
      acc[year] = Array(12).fill(0);
    }

    acc[year][month - 1]++;

    return acc;
  }, {});

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: `Nombre de contributions ${
        filter === "object" ? "par objet" : "via formulaire contact"
      } par mois et par année`,
    },
    xAxis: {
      categories: [
        "Jan",
        "Fev",
        "Mar",
        "Avr",
        "Mai",
        "Jun",
        "Jul",
        "Aou",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    series: Object.entries(contributionsByMonth).map(
      ([year, contributions]) => ({
        name: year,
        data: contributions,
      })
    ),
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

export default ContributionsGraphByYear;
