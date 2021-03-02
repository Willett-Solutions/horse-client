import React from "react";
import Select from "react-select";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import * as Rota from "./rota";

type SelectionFormProps = {
  onPlanRotaSheet: (rotaDocument: Rota.Document) => void,
  disabled: boolean,
}

type SelectionFormState = {
  sheetOptions: { value: string, label: string }[],
  selectedOption: { value: string, label: string } | null,
}

class SelectionForm extends React.Component<SelectionFormProps, SelectionFormState> {
  private readonly fileInput: React.RefObject<HTMLInputElement>;
  private readonly rotaDocument: Rota.Document;

  constructor(props: SelectionFormProps) {
    super(props);
    this.state = {
      sheetOptions: [],
      selectedOption: null,
    }
    this.fileInput = React.createRef();
    this.rotaDocument = new Rota.Document();
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.handleSheetChange = this.handleSheetChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFileInputChange(event: React.FormEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (file) {
      this.rotaDocument.load(file).then(sheetNames =>
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
    this.rotaDocument.sheetName = this.state.selectedOption!.value;
    this.props.onPlanRotaSheet(this.rotaDocument);
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <fieldset disabled={this.props.disabled}>
          <Form.Group>
            <Form.Label>File containing rota sheet:</Form.Label>
            <Form.File ref={this.fileInput} onChange={this.handleFileInputChange}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Rota sheet to be planned:</Form.Label>
            <Select
              options={this.state.sheetOptions}
              value={this.state.selectedOption}
              onChange={this.handleSheetChange}
              isDisabled={this.state.sheetOptions.length === 0}
              placeholder="Select rota sheet"/>
          </Form.Group>
          <Button type="submit" disabled={this.state.selectedOption === null}>
            Plan rota sheet
          </Button>
        </fieldset>
      </Form>
    );
  }
}

export default SelectionForm;