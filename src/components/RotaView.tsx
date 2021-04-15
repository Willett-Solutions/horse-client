import React from "react";
import {Table} from "react-bootstrap";
import * as Rota from "./model/rota";

function RotaView(props: { table: Rota.ShiftTable | null }) {
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
          {
            props.table?.employees.map(employee =>
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
      </Table>
      {
        props.table !== null &&
        <h5>
          Unassigned duties: {props.table.unassignedTaskCount}
        </h5>
      }
    </React.Fragment>
  );
}

export default RotaView;
