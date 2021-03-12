import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import SelectionForm from "./SelectionForm";
import * as Rota from "./model/rota";
import horse_start from "./horse-start.gif";
import horse_animation from "./horse-animation.gif";
import horse_end from "./horse-end.gif";

enum Phase {
  INITIAL,
  SOLVING,
  FINISHED,
}

type ControlPanelProps = {
  hasFinished: boolean,
  onFinished: (solvedRotaDocument: Rota.Document) => void,
  onSaveFile: () => void,
};

type ControlPanelState = {
  hasStartedSolving: boolean,
};

class ControlPanel extends React.Component<ControlPanelProps, ControlPanelState> {
  constructor(props: ControlPanelProps) {
    super(props);
    this.state = {
      hasStartedSolving: false,
    };
    this.handlePlanRotaSheet = this.handlePlanRotaSheet.bind(this);
  }

  render() {
    let phase: Phase;
    if (!this.state.hasStartedSolving) {
      phase = Phase.INITIAL;
    } else if (!this.props.hasFinished) {
      phase = Phase.SOLVING;
    } else {
      phase = Phase.FINISHED;
    }

    return (
      <Container fluid className="p-0">
        <Row noGutters>
          <Col>
            {(!this.props.hasFinished)
              ? <SelectionForm
                onPlanRotaSheet={this.handlePlanRotaSheet}
                disabled={this.state.hasStartedSolving}/>
              : <SolvedNotice
                onSaveRotaFile={() => this.props.onSaveFile()}
                />
            }
          </Col>
          <Col xs="auto" className="pl-3 align-self-end">
            <HorseAnimation phase={phase}/>
          </Col>
        </Row>
      </Container>
    );
  }

  private handlePlanRotaSheet(rotaDocument: Rota.Document, sheetName: string) {
    this.setState({hasStartedSolving: true});
    rotaDocument.solve(sheetName).then(() => {this.props.onFinished(rotaDocument)});
  }
}

function SolvedNotice(props: { onSaveRotaFile: () => void }) {
  return (
    <div>
      <p>All done! HORSE has successfully completed the rota sheet for the specified week. If you are happy with
        the assignments listed in the table, click the "Save rota file" button to save the file containing the
        completed rota, then follow the instructions below.</p>
      <Button onClick={props.onSaveRotaFile}>Save rota file</Button>
    </div>
  );
}

function HorseAnimation(props: { phase: Phase }) {
  switch (props.phase) {
    case Phase.INITIAL:
      return <img src={horse_start} alt="Horse ready and waiting"/>
    case Phase.SOLVING:
      return <img src={horse_animation} alt="Horse working hard"/>
    case Phase.FINISHED:
      return <img src={horse_end} alt="Horse all finished"/>
  }
}

export default ControlPanel;
