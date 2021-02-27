import React from "react";

function InstructionPanel(props: { hasFinished: boolean }) {
  return (
    <div className="Panel">
      <h2>Instructions</h2>
      {!props.hasFinished ? (
        <ul>
          <li>
            Start by clicking the "Choose file" button above. A file selection window will open.
          </li>
          <li>
            Browse to the folder containing the shift rota file (e.g. "Shifts.xlsx") and select that file. Click "Open".
            The file selection window will close, and you will see the name of the selected file next to the "Choose
            file" button.
          </li>
          <li>
            Now click the "Enter sheet name" input field, and enter the name of the sheet to be planned, e.g.
            "25-01-2021".
          </li>
          <li>
            Click the "Upload file" button. Wait for about 5 seconds while HORSE plans the rota for the sheet you chose.
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            When the "Save As" window opens, click "Save". The downloaded file is saved the file under the name of the
            uploaded file with a "(1)" suffix, e.g. "Shifts (1).xlsx".
          </li>
          <li>
            Finally, open the downloaded file and check that the rota has been planned as desired. If all is well, save
            the downloaded file so that it overwrites the original file, and then delete the file with the "(1)" suffix.
          </li>
        </ul>
      )}
    </div>
  );
}

export default InstructionPanel;
