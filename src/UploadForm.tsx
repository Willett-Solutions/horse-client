import React from "react";
import Select from "react-select";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import * as Rota from "./rota";

type UploadFormProps = {
  onUploadFile: (file: File | undefined) => void,
  disabled: boolean,
}

type UploadFormState = {
  sheetOptions: { value: string, label: string }[],
  selectedOption: { value: string, label: string } | null,
}

class UploadForm extends React.Component<UploadFormProps, UploadFormState> {
  private readonly fileInput: React.RefObject<HTMLInputElement>;
  private readonly rotaDoc: Rota.Document;

  constructor(props: UploadFormProps) {
    super(props);
    this.state = {
      sheetOptions: [],
      selectedOption: null,
    }
    this.fileInput = React.createRef();
    this.rotaDoc = new Rota.Document();
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.handleSheetChange = this.handleSheetChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFileInputChange(event: React.FormEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (file) {
      this.rotaDoc.load(file).then(sheetNames =>
        this.setState({
          sheetOptions: sheetNames.map(sheetName =>
            ({value: sheetName, label: sheetName})),
          selectedOption: null,
        })
      );
    }
  }

  handleSheetChange(option: { value: string, label: string } | null) {
    this.setState({selectedOption: option})
  }

  handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.props.onUploadFile(this.fileInput.current?.files?.[0]);
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <fieldset disabled={this.props.disabled}>
          <Form.Group>
            <Form.Label>File containing rota:</Form.Label>
            <Form.File ref={this.fileInput} onChange={this.handleFileInputChange}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Sheet to be planned:</Form.Label>
            <Select
              options={this.state.sheetOptions}
              value={this.state.selectedOption}
              onChange={this.handleSheetChange}
              isDisabled={this.state.sheetOptions.length === 0}
              placeholder="Select sheet"/>
          </Form.Group>
          <Button type="submit" disabled={this.state.selectedOption === null}>
            Upload file
          </Button>
        </fieldset>
      </Form>
    );
  }
}

export default UploadForm;