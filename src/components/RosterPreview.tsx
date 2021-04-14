import React from "react";
import {Table} from "react-bootstrap";
import * as Rota from "./model/rota";
import {Roster} from "./model/domain/roster";

function RosterPreview(props: { table: Rota.ShiftTable | null }) {
  let tbody: JSX.Element | undefined;
  let unassignedTaskCount = 0;

  if (props.table !== null) {
    const roster = Roster.fromTable(props.table);
    const employees = roster.employees;

    tbody =
      <tbody>
        {
          employees.map(employee =>
            <tr>
              <td>{employee.name}</td>
              {
                props.table!.getRecord(employee)!.shiftFields.map(field =>
                  <td {...({style: {backgroundColor: field.color.hex()}})} />
                )
              }
            </tr>
          )
        }
      </tbody>
    unassignedTaskCount = roster.getUnassignedTaskCount();
  }

  return (
    <React.Fragment>
      <Table bordered size="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th colSpan={2}>Monday</th>
            <th colSpan={2}>Tuesday</th>
            <th colSpan={2}>Wednesday</th>
            <th colSpan={2}>Thursday</th>
            <th colSpan={2}>Friday</th>
          </tr>
          <tr>
            <th style={{width: "10%"}}/>
            <th style={{width: "9%"}}>AM</th>
            <th style={{width: "9%"}}>PM</th>
            <th style={{width: "9%"}}>AM</th>
            <th style={{width: "9%"}}>PM</th>
            <th style={{width: "9%"}}>AM</th>
            <th style={{width: "9%"}}>PM</th>
            <th style={{width: "9%"}}>AM</th>
            <th style={{width: "9%"}}>PM</th>
            <th style={{width: "9%"}}>AM</th>
            <th style={{width: "9%"}}>PM</th>
          </tr>
        </thead>
        {tbody}
      </Table>
      {
        props.table !== null &&
        <h5>
          Unassigned duties: {unassignedTaskCount}
        </h5>
      }
    </React.Fragment>
  );
}

export default RosterPreview;
