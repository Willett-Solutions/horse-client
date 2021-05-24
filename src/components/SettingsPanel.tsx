import React from "react";
import Settings from "./model/settings";
import Form from "react-bootstrap/Form";
import DutyGrid from "./DutyGrid";

function SettingsPanel({settings}: { settings: Settings }) {
  return (
    <Form.Group>
      <Form.Label>Duties to be assigned:</Form.Label>
      <DutyGrid tasksPerShift={settings.tasksPerShift}/>
    </Form.Group>
  );
}

export default SettingsPanel;
