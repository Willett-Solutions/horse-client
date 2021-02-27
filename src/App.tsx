import React from "react";
import ControlPanel from "./ControlPanel";
import InstructionPanel from "./InstructionPanel";
import "./App.css";

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

export default App;
