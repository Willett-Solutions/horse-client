import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ControlPanel from "./ControlPanel";
import InstructionPanel from "./InstructionPanel";
import Container from "react-bootstrap/Container";
import "./App.css";

type AppState = {
  hasFinished: boolean;
};

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      hasFinished: false,
    }
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
              hasFinished={this.state.hasFinished}
              onFinished={() => this.setState({hasFinished: true})}
            />
          </section>
          <section>
            <InstructionPanel hasFinished={this.state.hasFinished}/>
          </section>
        </main>
        <footer>
          <p>Version {process.env.REACT_APP_VERSION}</p>
        </footer>
      </Container>
    );
  }
}

export default App;
