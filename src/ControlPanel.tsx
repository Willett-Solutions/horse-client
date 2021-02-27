import React from "react";
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
  constructor(props: ControlPanelProps) {
    super(props);
    this.state = {
      hasStartedSolving: false,
    };
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleUpload() {
    this.setState({hasStartedSolving: true});
    const rotaDoc = new Rota.Document();
    rotaDoc.load().then(() => {
      rotaDoc.solve().then(() => {
        this.props.onFinished();
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
      <div className="Panel ControlPanel">
        {(!this.props.hasFinished)
          ? <UploadForm
            onUpload={this.handleUpload}
            disabled={this.state.hasStartedSolving}/>
          : <DownloadNotice/>}
        <HorseAnimation phase={phase}/>
      </div>
    );
  }
}

type UploadFormProps = {
  onUpload: () => void,
  disabled: boolean,
}

class UploadForm extends React.Component<UploadFormProps> {
  private readonly fileInput: React.RefObject<HTMLInputElement>;

  constructor(props: UploadFormProps) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }

  handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.props.onUpload();
    console.log(this.fileInput.current?.files?.[0]?.name);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <fieldset disabled={this.props.disabled}>
          <label>
            File containing rota:
            <input type="file" ref={this.fileInput}/>
          </label>
          <label>
            Sheet to be planned:
            <input type="text" placeholder="Enter sheet name"/>
          </label>
          <button type="submit">
            Upload file
          </button>
        </fieldset>
      </form>
    );
  }
}

function DownloadNotice() {
  return (
    <div>
      <p>All done! HORSE has successfully completed the staff rota for the specified week. If you are happy with
        the assignments listed in the table, click the "Download file" button to download the file containing the
        completed rota, then follow the instructions below.</p>
      <button>Download file</button>
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
