import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import FileSaver from "file-saver";
import ControlPanel from "./components/ControlPanel";
import InstructionPanel from "./components/InstructionPanel";
import Container from "react-bootstrap/Container";
import * as Rota from "./components/model/rota";
import "./App.css";
import SummaryTable from "./components/SummaryTable";

type AppState = {
  solvedRotaDocument: Rota.Document | null;
};

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      solvedRotaDocument: null,
    }
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
              hasFinished={this.state.solvedRotaDocument !== null}
              onFinished={solvedRotaDocument => this.setState({solvedRotaDocument: solvedRotaDocument})}
              onSaveFile={this.handleSaveFile}
            />
          </section>
          {this.state.solvedRotaDocument !== null
          && <SummaryTable summary={this.state.solvedRotaDocument.solution!.summary()}/>}
          <section>
            <InstructionPanel hasFinished={this.state.solvedRotaDocument !== null}/>
          </section>
        </main>
        <footer>
          <p>Version {process.env.REACT_APP_VERSION}</p>
        </footer>
      </Container>
    );
  }

  private handleSaveFile() {
    this.state.solvedRotaDocument!.write().then(file => {
      FileSaver.saveAs(file);
    });
  }
}

export default App;
