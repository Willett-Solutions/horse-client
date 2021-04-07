import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ControlPanel from "./components/ControlPanel";
import InstructionPanel from "./components/InstructionPanel";
import "./App.css";
import RosterPreview from "./components/RosterPreview";
import StatisticsView from "./components/StatisticsView";
import {Col, Container, Row} from "react-bootstrap";
import * as Rota from "./components/model/rota";

type AppState = {
  document: Rota.Document | null,
  isSolved: boolean,
};

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      document: null,
      isSolved: false,
    }
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
                  <InstructionPanel hasFinished={this.state.isSolved}/>
                </aside>
              </Col>
              <Col xl={3} md={6}>
                <section>
                  <ControlPanel
                    hasFinished={this.state.isSolved}
                    onSheetSelected={document => this.setState({document: document})}
                    onFinished={document => this.setState({document: document, isSolved: true})}
                  />
                </section>
              </Col>
              <Col xl={6}>
                <section>
                  <RosterPreview document={this.state.document}/>
                </section>
                {
                  this.state.isSolved &&
                    <section>
                      <StatisticsView document={this.state.document!}/>
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
}

export default App;
