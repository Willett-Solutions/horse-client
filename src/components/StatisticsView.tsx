import React from "react";
import {Table} from "react-bootstrap";
import * as Rota from "./model/rota";

function StatisticsView(props: { document: Rota.Document }) {
  return (
    <Table bordered striped size="sm" className="m-0">
      <thead>
        <tr>
          <th colSpan={4}>Statistics</th>
        </tr>
        <tr>
          <th>Name</th>
          <th>Duties Performed</th>
          <th>Duties as % of Working Time</th>
        </tr>
      </thead>
      <tbody>
        {
          props.document.getRoster().employees
            .filter(employee => employee.priorTaskCount > 0)
            .map(employee =>
              <tr>
                <td>{employee.name}</td>
                <td>{employee.priorTaskCount}</td>
                <td>{Math.round(100 * employee.priorTaskCount / employee.priorShiftCount) + "%"}</td>
              </tr>
            )
        }
      </tbody>
    </Table>
  )
}

export default StatisticsView;
