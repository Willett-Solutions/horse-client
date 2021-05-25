import React from "react";
import Settings from "./model/settings";
import Form from "react-bootstrap/Form";
import DutyGrid from "./DutyGrid";

function SettingsPanel({settings, onChange}: {
  settings: Settings,
  onChange: (settings: Settings) => void,
}) {
  return (
    <Form.Group>
      <Form.Label>Number of duties to be assigned:</Form.Label>
      <DutyGrid
        settings={settings}
        onChange={onChange}
      />
    </Form.Group>
  );
}

export default SettingsPanel;
