import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import FileSaver from "file-saver";
import ControlPanel from "./components/ControlPanel";
import InstructionPanel from "./components/InstructionPanel";
import "./App.css";
import RosterPreview from "./components/RosterPreview";
import {Roster} from "./components/model/domain";
import Solver from "./components/model/solver";
import {Col, Container, Row} from "react-bootstrap";

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
        <Row className="justify-content-center">
          <header>
            <h1>
              <span>Haemato-</span><span>Oncology</span> <span>Rota</span> <span>Shift</span> <span>Evaluator</span>
            </h1>
            <p>Version {process.env.REACT_APP_VERSION}</p>
          </header>
        </Row>
        <Row>
          <Col xs={4}>
            <main>
              <section>
                <ControlPanel
                  solver={this.solver}
                  hasFinished={this.state.roster !== null}
                  onFinished={roster => this.setState({roster: roster})}
                  onSaveFile={this.handleSaveFile}
                />
              </section>
            </main>
          </Col>
          <Col xs={8}>
            <aside>
              <InstructionPanel hasFinished={this.state.roster !== null}/>
            </aside>
            {this.state.roster !== null && <RosterPreview roster={this.state.roster}/>}
          </Col>
        </Row>
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
