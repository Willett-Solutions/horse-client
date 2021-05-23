import React from "react";
import {Table} from "react-bootstrap";
import * as Rota from "./model/rota";
import Settings from "./model/settings";

interface RotaViewParams {
  settings: Settings;
  table: Rota.ShiftTable | null;
}

function RotaView(props: RotaViewParams) {
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
          Unassigned duties: {props.settings.getUnassignedTaskCount(props.table)}
        </h5>
      }
    </React.Fragment>
  );
}

export default RotaView;
