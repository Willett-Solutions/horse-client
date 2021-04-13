import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React from "react";
import {Col, Container, Row, Tab, Tabs} from "react-bootstrap";
import ControlPanel from "./components/ControlPanel";
import InstructionPanel from "./components/InstructionPanel";
import RosterPreview from "./components/RosterPreview";
import StatisticsView from "./components/StatisticsView";
import * as Rota from "./components/model/rota";

type AppState = {
  table: Rota.ShiftTable | null,
  isSolved: boolean,
};

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      table: null,
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
                    onSheetSelected={table => this.setState({table: table})}
                    onFinished={() => this.setState({isSolved: true})}
                  />
                </section>
              </Col>
              <Col xl={6}>
                <section>
                  <Tabs defaultActiveKey="rota">
                    <Tab eventKey="rota" title="Rota">
                      <RosterPreview table={this.state.table}/>
                    </Tab>
                    <Tab eventKey="statistics" title="Statistics">
                      <StatisticsView table={this.state.table}/>
                    </Tab>
                  </Tabs>
                </section>
              </Col>
            </Row>
          </Container>
        </main>
        <footer>
          <p>Released from the stable by David Willett (<a
            href="mailto:david.m.willett@gmail.com">david.m.willett@gmail.com</a>)</p>
        </footer>
      </React.Fragment>
    );
  }
}

export default App;
