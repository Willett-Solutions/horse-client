import React from "react";
import {Table} from "react-bootstrap";
import Settings from "./model/settings";
import Form from "react-bootstrap/Form";

type SettingsPanelProps = {
  settings: Settings,
};

type SettingsPanelState = {};

class SettingsPanel extends React.Component<SettingsPanelProps, SettingsPanelState> {
  render() {
    return (
      <Form.Group>
        <Form.Label>Duties to be assigned:</Form.Label>
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
            <th>AM</th>
            <th>PM</th>
            <th>AM</th>
            <th>PM</th>
            <th>AM</th>
            <th>PM</th>
            <th>AM</th>
            <th>PM</th>
            <th>AM</th>
            <th>PM</th>
          </thead>
          <tbody>
            {
              Array.from(this.props.settings.tasksPerShift, ([duty, taskCounts]) =>
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
      </Form.Group>
    );
  }
}

export default SettingsPanel;