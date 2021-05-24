import React from "react";
import {Duty, Shift} from "./model/domain/task";
import {Table} from "react-bootstrap";

function DutyGrid({tasksPerShift}: { tasksPerShift: Map<Duty, Array<number>> }) {
  return (
    <Table bordered size="sm">
      <thead>
        <th>Duty</th>
        <th colSpan={2}>Mon</th>
        <th colSpan={2}>Tue</th>
        <th colSpan={2}>Wed</th>
        <th colSpan={2}>Thu</th>
        <th colSpan={2}>Fri</th>
      </thead>
      <thead>
        <th/>
        {
          Shift.enumValues.map(value => <th>{value.enumOrdinal % 2 === 0 ? "AM" : "PM"}</th>)
        }
      </thead>
      <tbody>
        {
          Array.from(tasksPerShift, ([duty, taskCounts]) =>
            <tr>
              <td>{duty.description}</td>
              {
                taskCounts.map(taskCount => <td>{taskCount}</td>)
              }
            </tr>
          )
        }
      </tbody>
    </Table>
  );
}

export default DutyGrid;