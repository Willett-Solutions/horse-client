import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import FileSaver from "file-saver";
import UploadForm from "./UploadForm";
import * as Rota from "./rota";

enum Phase {
  INITIAL,
  SOLVING,
  FINISHED,
}

type ControlPanelProps = {
  hasFinished: boolean,
  onFinished: () => void,
};

type ControlPanelState = {
  hasStartedSolving: boolean,
};

class ControlPanel extends React.Component<ControlPanelProps, ControlPanelState> {
  private _downloadFile: File | null = null;

  private get downloadFile() {
    return this._downloadFile!;
  }

  private set downloadFile(file: File) {
    this._downloadFile = file;
    this.props.onFinished();
  }

  constructor(props: ControlPanelProps) {
    super(props);
    this.state = {
      hasStartedSolving: false,
    };
    this.handleUploadFile = this.handleUploadFile.bind(this);
  }

  handleUploadFile(file: File | undefined) {
    if (file === undefined) return;
    this.setState({hasStartedSolving: true});
    const rotaDoc = new Rota.Document();
    rotaDoc.load(file).then(() => {
      rotaDoc.solve().then(file => {
        this.downloadFile = file;
      });
    });
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
              ? <UploadForm
                onUploadFile={this.handleUploadFile}
                disabled={this.state.hasStartedSolving}/>
              : <DownloadNotice
                onDownloadFile={() => FileSaver.saveAs(this.downloadFile)}/>}
          </Col>
          <Col xs="auto" className="pl-3 align-self-end">
            <HorseAnimation phase={phase}/>
          </Col>
        </Row>
      </Container>
    );
  }
}

function DownloadNotice(props: { onDownloadFile: () => void }) {
  return (
    <div>
      <p>All done! HORSE has successfully completed the staff rota for the specified week. If you are happy with
        the assignments listed in the table, click the "Download file" button to download the file containing the
        completed rota, then follow the instructions below.</p>
      <Button onClick={props.onDownloadFile}>Download file</Button>
    </div>
  );
}

function HorseAnimation(props: { phase: Phase }) {
  switch (props.phase) {
    case Phase.INITIAL:
      return <img src="horse-start.gif" alt="Horse ready and waiting"/>
    case Phase.SOLVING:
      return <img src="horse-animation.gif" alt="Horse working hard"/>
    case Phase.FINISHED:
      return <img src="horse-end.gif" alt="Horse all finished"/>
  }
}

export default ControlPanel;
