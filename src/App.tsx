import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <p>
          <span>Haemato-</span><span>Oncology</span> <span>Rota</span> <span>Shift</span> <span>Evaluator</span>
        </p>
      </header>
      <ControlPanel/>
      <InstructionPanel/>
      <footer>
        <p>
          Version {process.env.REACT_APP_VERSION}
        </p>
      </footer>
    </div>
  );
}

function ControlPanel() {
  return (
    <div className="Panel ControlPanel">
      <UploadForm/>
      <HorseAnimation/>
    </div>
  );
}

function UploadForm() {
  return (
    <form className="UploadForm">
      <label>
        File containing rota:
        <input type="file"/>
      </label>
      <label>
        Sheet to be planned:
        <input type="text" placeholder="Enter sheet name"/>
      </label>
      <button type="submit">
        Upload file
      </button>
    </form>
  );
}

function HorseAnimation() {
  return (
    <img src="horse-start.gif" alt="Horse ready and waiting"/>
  );
}

function InstructionPanel() {
  return (
    <div className="Panel">
      <h2>Instructions</h2>
      <ul>
        <li>
          <span>Start by clicking the "Choose file" button above. A file selection window will open.</span>
        </li>
        <li>
        <span>Browse to the folder containing the shift rota file (e.g. "Shifts.xlsx") and select that file. Click
        "Open". The file selection window will close, and you will see the name of the selected file next to the
        "Choose file" button.</span>
        </li>
        <li>
        <span>Now click the "Enter sheet name" input field, and enter the name of the sheet to be planned, e.g.
        "25-01-2021".</span>
        </li>
        <li>
        <span>Click the "Upload file" button. Wait for about 5 seconds while HORSE plans the rota for the sheet
        you chose.</span>
        </li>
      </ul>
    </div>
  );
}

export default App;
