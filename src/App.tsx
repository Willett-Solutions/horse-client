import React from 'react';
import './App.css';

type AppState = {
  hasFinished: boolean;
};

class App extends React.Component<{}, AppState> {
  state: AppState = {
    hasFinished: false,
  }

  render() {
    return (
      <div className="App">
        <header>
          <p>
            <span>Haemato-</span><span>Oncology</span> <span>Rota</span> <span>Shift</span> <span>Evaluator</span>
          </p>
        </header>
        <ControlPanel/>
        <InstructionPanel hasFinished={this.state.hasFinished}/>
        <footer>
          <p>
            Version {process.env.REACT_APP_VERSION}
          </p>
        </footer>
      </div>
    );
  }
}

enum Phase {
  INITIAL,
  SOLVING,
  FINISHED,
}

type ControlPanelState = {
  phase: Phase,
}

class ControlPanel extends React.Component<{}, ControlPanelState> {
  state: ControlPanelState = {
    phase: Phase.INITIAL,
  }

  render() {
    return (
      <div className="Panel ControlPanel">
        <UploadForm/>
        <HorseAnimation phase={this.state.phase}/>
      </div>
    );
  }
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

function HorseAnimation(props: { phase: Phase }) {
  switch (props.phase) {
    case Phase.INITIAL:
      return <img src="horse-start.gif" alt="Horse ready and waiting"/>
    case Phase.SOLVING:
      return <img src="horse-animation.gif" alt="Horse working hard"/>
    case Phase.FINISHED:
      return <img src="horse-end.gif" alt="Horse all finished"/>
  }
}

function InstructionPanel(props: { hasFinished: boolean }) {
  return (
    <div className="Panel">
      <h2>Instructions</h2>
      {!props.hasFinished ? (
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
      ) : (
        <ul>
          <li>
            <span>When the "Save As" window opens, click "Save". The downloaded file is saved the file under the name
            of the uploaded file with a "(1)" suffix, e.g. "Shifts (1).xlsx".</span>
          </li>
          <li>
            <span>Finally, open the downloaded file and check that the rota has been planned as desired. If all is well,
            save the downloaded file so that it overwrites the original file, and then delete the file with the "(1)"
            suffix.</span>
          </li>
        </ul>
      )}
    </div>
  );
}

export default App;
