import React from "react";

type UploadFormProps = {
  onUploadFile: (file: File | undefined) => void,
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
    this.props.onUploadFile(this.fileInput.current?.files?.[0]);
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
            <select disabled />
          </label>
          <button type="submit">
            Upload file
          </button>
        </fieldset>
      </form>
    );
  }
}

export default UploadForm;