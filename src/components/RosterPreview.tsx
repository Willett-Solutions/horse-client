import React from "react";
import {Table} from "react-bootstrap";
import {Duty, Roster, Shift} from "./model/domain";

function RosterPreview(props: { roster: Roster | null }) {
  let tbody: JSX.Element | undefined;
  let unassignedTaskCount = 0;

  if (props.roster !== null) {
    const nameToDutiesMap: Map<string, Array<Duty>> = new Map();
    props.roster.employees.forEach(employee =>
      nameToDutiesMap.set(employee.name, new Array(Shift.enumValues.length).fill(undefined))
    );
    props.roster.tasks.forEach(task => {
      const employee = task.employee;
      if (employee !== null) {
        const duties = nameToDutiesMap.get(employee.name);
        duties![task.shift.enumOrdinal] = task.duty;
      } else {
        unassignedTaskCount++;
      }
    });
    tbody =
      <React.Fragment>
        {
          Array.from(nameToDutiesMap)
            .filter(([, duties]) => duties.some(duty => duty !== undefined))
            .map(([name, duties]) =>
              <tr>
                <td>{name}</td>
                {
                  duties.map(duty => <td {...(duty && {style: {backgroundColor: duty.color.hex()}})}/>)
                }
              </tr>
            )
        }
      </React.Fragment>
  }

  return (
    <React.Fragment>
      <Table bordered size="sm">
        <thead>
          <tr>
            <th colSpan={11}>Rota Preview</th>
          </tr>
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
        props.roster !== null &&
        <h2>
          Unassigned duties: {unassignedTaskCount}
        </h2>
      }
    </React.Fragment>
  );
}

export default RosterPreview;
