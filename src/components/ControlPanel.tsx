import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import SelectionForm from "./SelectionForm";
import horse_start from "./horse-start.gif";
import horse_animation from "./horse-animation.gif";
import horse_end from "./horse-end.gif";
import Solver from "./model/solver";
import * as Rota from "./model/rota";
import FileSaver from "file-saver";

enum Phase {
  INITIAL,
  SOLVING,
  FINISHED,
}

type ControlPanelProps = {
  hasFinished: boolean,
  onSheetSelected: (table: Rota.ShiftTable) => void,
  onFinished: (table: Rota.ShiftTable) => void,
};

type ControlPanelState = {
  hasStartedSolving: boolean,
};

class ControlPanel extends React.Component<ControlPanelProps, ControlPanelState> {
  private readonly solver = new Solver();
  private table: Rota.ShiftTable | null = null;

  constructor(props: ControlPanelProps) {
    super(props);
    this.handleSheetSelected = this.handleSheetSelected.bind(this);
    this.handlePlanRotaSheet = this.handlePlanRotaSheet.bind(this);
    this.handleSaveFile = this.handleSaveFile.bind(this);
    this.state = {
      hasStartedSolving: false,
    };
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
        <Row>
          <Col className="text-center pb-3">
            <HorseAnimation phase={phase}/>
          </Col>
        </Row>
        <Row noGutters>
          <Col>
            {(!this.props.hasFinished)
              ? <SelectionForm
                onSheetSelected={this.handleSheetSelected}
                onPlanRotaSheet={this.handlePlanRotaSheet}
                disabled={this.state.hasStartedSolving}/>
              : <SolvedNotice
                onSaveRotaFile={this.handleSaveFile}
                />
            }
          </Col>
        </Row>
      </Container>
    );
  }

  private handleSheetSelected(table: Rota.ShiftTable) {
    this.table = table;
    this.props.onSheetSelected(table);
  }

  private handlePlanRotaSheet() {
    this.setState({hasStartedSolving: true});
    this.solver.solve(this.table!).then(() => this.props.onFinished(this.table!));
  }

  private handleSaveFile() {
    this.table!.document.getFile().then(file => FileSaver.saveAs(file));
  }
}


function SolvedNotice(props: { onSaveRotaFile: () => void }) {
  return (
    <div>
      <p>All done! HORSE has successfully completed the rota sheet for the specified week. If you are happy with
        the assignments shown in the preview, click the "Save rota file" button to save the file containing the
        completed rota, then follow the instructions.</p>
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
