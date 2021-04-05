import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import FileSaver from "file-saver";
import ControlPanel from "./components/ControlPanel";
import InstructionPanel from "./components/InstructionPanel";
import "./App.css";
import RosterPreview from "./components/RosterPreview";
import StatisticsView from "./components/StatisticsView";
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
      <React.Fragment>
        <header>
          <h1>
            <span>Haemato-</span><span>Oncology</span> <span>Rota</span> <span>Sheet</span> <span>Evaluator</span>
          </h1>
          <p>Version {process.env.REACT_APP_VERSION}</p>
        </header>
        <main>
          <Container fluid id="content">
            <Row noGutters className="p-3">
              <Col xl={3} md={6}>
                <aside>
                  <InstructionPanel hasFinished={this.state.roster !== null}/>
                </aside>
              </Col>
              <Col xl={3} md={6}>
                <section>
                  <ControlPanel
                    solver={this.solver}
                    hasFinished={this.state.roster !== null}
                    onFinished={roster => this.setState({roster: roster})}
                    onSaveFile={this.handleSaveFile}
                  />
                </section>
              </Col>
              <Col xl={6}>
                <section>
                  <RosterPreview roster={this.state.roster}/>
                </section>
                {
                  this.state.roster !== null &&
                    <section>
                      <StatisticsView roster={this.state.roster}/>
                    </section>
                }
              </Col>
            </Row>
          </Container>
        </main>
        <footer>
          <p>Released from the stable by David Willett (<a href="mailto:david.m.willett@gmail.com">david.m.willett@gmail.com</a>)</p>
        </footer>
      </React.Fragment>
    );
  }

  private handleSaveFile() {
    this.solver.getFile(this.state.roster!).then(file => {
      FileSaver.saveAs(file);
    });
  }
}

export default App;
