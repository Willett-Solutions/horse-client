import React from "react";
import {Table} from "react-bootstrap";
import * as Rota from "./model/rota";

function StatisticsView(props: { table: Rota.ShiftTable | null }) {
  return (
    <Table bordered striped size="sm" className="m-0">
      <thead>
        <tr>
          <th>Name</th>
          <th>Duties Performed</th>
          <th>Duties as % of Working Time</th>
        </tr>
      </thead>
      <tbody>
        {
          props.table?.employees
            .filter(employee => employee.priorShiftCount > 0)
            .sort(((e1, e2) => e2.taskLoad - e1.taskLoad))
            .map(employee =>
              <tr>
                <td>{employee.name}</td>
                <td>{employee.priorTaskCount}</td>
                <td>{Math.round(100 * employee.taskLoad) + "%"}</td>
              </tr>
            )
        }
      </tbody>
    </Table>
  )
}

export default StatisticsView;
