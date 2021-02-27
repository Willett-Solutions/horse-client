import React from "react";

enum Phase {
  INITIAL,
  SOLVING,
  FINISHED,
}

type ControlPanelState = {
  phase: Phase,
}

class ControlPanel extends React.Component<{}, ControlPanelState> {
  state: ControlPanelState = {
    phase: Phase.INITIAL,
  }

  render() {
    const {phase} = this.state;
    return (
      <div className="Panel ControlPanel">
        {(phase !== Phase.FINISHED)
          ? <UploadForm
            onUpload={() => this.setState({phase: Phase.SOLVING})}
            disabled={phase !== Phase.INITIAL}/>
          : <DownloadNotice/>}
        <HorseAnimation phase={phase}/>
      </div>
    );
  }
}

function UploadForm(props: { onUpload: () => void, disabled: boolean }) {

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    props.onUpload();
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={props.disabled}>
        <label>
          File containing rota:
          <input type="file"/>
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
