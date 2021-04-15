import React from "react";
import {Table} from "react-bootstrap";
import * as Rota from "./model/rota";
import {Duty} from "./model/domain/task";

function StatisticsView(props: { table: Rota.ShiftTable | null }) {
  return (
    <Table bordered striped size="sm" className="m-0">
      <thead>
        <tr>
          <th rowSpan={2} style={{width: "15%"}}>Name</th>
          <th colSpan={5}>Duties Performed</th>
        </tr>
        <tr>
          <th style={{width: "12%"}}>FISH</th>
          <th style={{width: "12%"}}>DS</th>
          <th style={{width: "12%"}}>Late DS</th>
          <th style={{width: "12%"}}>SS</th>
          <th>As % of Working Time</th>
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
                <td>{employee.priorTaskCounts[Duty.FISH.enumOrdinal]}</td>
                <td>{employee.priorTaskCounts[Duty.DS.enumOrdinal]}</td>
                <td>{employee.priorTaskCounts[Duty.LATE_DS.enumOrdinal]}</td>
                <td>{employee.priorTaskCounts[Duty.SS.enumOrdinal]}</td>
                <td>{Math.round(100 * employee.taskLoad) + "%"}</td>
              </tr>
            )
        }
      </tbody>
    </Table>
  )
}

export default StatisticsView;
