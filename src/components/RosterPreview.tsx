import React from "react";
import {Table} from "react-bootstrap";
import * as Rota from "./model/rota";
import {ShiftField} from "./model/rota/field";
import Color from "color";

function RosterPreview(props: { document: Rota.Document | null }) {
  let tbody: JSX.Element | undefined;
  let unassignedTaskCount = 0;

  function getColor(field: ShiftField): Color {
    const duty = field.duty;
    if (duty !== null) {
      return duty.color;
    }
    const status = field.status;
    if (status !== null) {
      return status.color ?? Color("white");
    }
    return Color("white");
  }

  if (props.document !== null) {
    const roster = props.document.getRoster();
    const employees = roster.employees;

    tbody =
      <React.Fragment>
        {
          employees.map(employee =>
            <tr>
              <td>{employee.name}</td>
              {
                props.document!.getRecord(employee)!.shiftFields.map(field =>
                  <td {...({style: {backgroundColor: getColor(field).hex()}})} />
                )
              }
            </tr>
          )
        }
      </React.Fragment>
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
        <tbody>
          {tbody !== undefined && tbody}
        </tbody>
      </Table>
      {
        props.document !== null &&
        <h5>
          Unassigned duties: {unassignedTaskCount}
        </h5>
      }
    </React.Fragment>
  );
}

export default RosterPreview;
