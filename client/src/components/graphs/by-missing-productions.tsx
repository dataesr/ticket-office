// import { Col } from "@dataesr/dsfr-plus";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import { ClipLoader } from "react-spinners";

// const ContributionsGraphByStatus = ({ contributions, isLoading, isError }) => {
//   if (isLoading) {
//     return (
//       <Col className="comment">
//         <ClipLoader color="#123abc" size={50} />
//       </Col>
//     );
//   }

//   if (isError) {
//     return <div>Une erreur s'est produite</div>;
//   }

//   if (!Array.isArray(contributions)) {
//     return <div>Les données ne sont pas disponibles</div>;
//   }

//   const newCount = contributions.filter(
//     (contribution) => contribution.status === "new"
//   ).length;
//   const ongoingCount = contributions.filter(
//     (contribution) => contribution.status === "ongoing"
//   ).length;
//   const treatedCount = contributions.filter(
//     (contribution) => contribution.status === "treated"
//   ).length;

//   const chartData = [
//     { name: "New", y: newCount },
//     { name: "Ongoing", y: ongoingCount },
//     { name: "Treated", y: treatedCount },
//   ];

//   const options = {
//     chart: {
//       type: "pie",
//     },
//     title: {
//       text: "Nombre de demande d'affiliation par statut",
//     },
//     xAxis: {
//       type: "category",
//     },
//     yAxis: {
//       title: {
//         text: "Nombre de contributions",
//       },
//     },
//     series: [
//       {
//         name: "Statut",
//         data: chartData,
//       },
//     ],
//   };

//   return <HighchartsReact highcharts={Highcharts} options={options} />;
// };

// export default ContributionsGraphByStatus;
