import React from "react";
import "./InstructionPanel.css";

function InstructionPanel(props: { hasFinished: boolean }) {
  return (
    <React.Fragment>
      <h2>Instructions</h2>
      {!props.hasFinished ? (
        <ul className="horseshoe">
          <li>
            Start by clicking the "Choose file" button. A file selection window will open.
          </li>
          <li>
            Browse to the folder containing the shift rota file (e.g. "Shifts.xlsx") and select that file. Click
            "Open". The file selection window will close, and you will see the name of the selected file next to the
            "Choose file" button.
          </li>
          <li>
            Now click the "Select rota sheet" input field, and select the sheet to be planned.
          </li>
          <li>
            Click the "Plan rota sheet" button, and wait for about 5 seconds while HORSE plans the rota for the sheet
            you chose.
          </li>
        </ul>
      ) : (
        <ul className="horseshoe">
          <li>
            When the "Save As" window opens, click "Save". The rota file will then be saved with a "(1)" suffix, e.g.
            "Shifts (1).xlsx".
          </li>
          <li>
            Finally, open the saved file and check that the rota has been planned as desired. If all is well, save the
            new file so that it overwrites the original file, and then delete the file with the "(1)" suffix.
          </li>
        </ul>
      )}
    </React.Fragment>
  );
}

export default InstructionPanel;
