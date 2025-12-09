import { Row, Col } from "@dataesr/dsfr-plus";
import { formatDuration, formatNumber } from "./utils";

interface TopPage {
  label: string;
  nb_visits: number;
  avg_time_on_page: number;
  bounce_rate: string;
}

interface TopPagesTableProps {
  topPages: TopPage[];
}

const TopPagesTable = ({ topPages }: TopPagesTableProps) => {
  if (!topPages || topPages.length === 0) return null;

  return (
    <Row gutters className="fr-mt-3w">
      <Col xs="12">
        <div className="stat-table">
          <h4 className="stat-table__title">📊 Pages les plus visitées</h4>
          <table className="fr-table">
            <thead>
              <tr>
                <th>Page</th>
                <th>Visites</th>
                <th>Temps moyen</th>
                <th>Taux de rebond</th>
              </tr>
            </thead>
            <tbody>
              {topPages.map((page, index) => (
                <tr key={index}>
                  <td>
                    <span className="page-label">{page.label}</span>
                  </td>
                  <td>{formatNumber(page.nb_visits)}</td>
                  <td>{formatDuration(page.avg_time_on_page)}</td>
                  <td>{page.bounce_rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Col>
    </Row>
  );
};

export default TopPagesTable;
