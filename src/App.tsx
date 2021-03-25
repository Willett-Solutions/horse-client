import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import FileSaver from "file-saver";
import ControlPanel from "./components/ControlPanel";
import InstructionPanel from "./components/InstructionPanel";
import Container from "react-bootstrap/Container";
import "./App.css";
import RosterPreview from "./components/RosterPreview";
import {Roster} from "./components/model/domain";
import Solver from "./components/model/solver";

type AppState = {
  roster: Roster | null;
};

class App extends React.Component<{}, AppState> {
  solver: Solver;

  constructor(props: {}) {
    super(props);
    this.state = {
      roster: null,
    }
    this.solver = new Solver();
    this.handleSaveFile = this.handleSaveFile.bind(this);
  }

  render() {
    return (
      <Container fluid id="content">
        <header>
          <h1>
            <span>Haemato-</span><span>Oncology</span> <span>Rota</span> <span>Shift</span> <span>Evaluator</span>
          </h1>
        </header>
        <main>
          <section>
            <ControlPanel
              solver={this.solver}
              hasFinished={this.state.roster !== null}
              onFinished={roster => this.setState({roster: roster})}
              onSaveFile={this.handleSaveFile}
            />
          </section>
          {this.state.roster !== null && <RosterPreview roster={this.state.roster}/>}
          <section>
            <InstructionPanel hasFinished={this.state.roster !== null}/>
          </section>
        </main>
        <footer>
          <p>Version {process.env.REACT_APP_VERSION}</p>
        </footer>
      </Container>
    );
  }

  private handleSaveFile() {
    this.solver.getFile(this.state.roster!).then(file => {
      FileSaver.saveAs(file);
    });
  }
}

export default App;
