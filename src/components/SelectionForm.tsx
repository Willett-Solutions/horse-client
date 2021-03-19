import React from "react";
import Select from "react-select";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Solver from "./model/solver";

type SelectionFormProps = {
  solver: Solver,
  onPlanRotaSheet: (sheetName: string) => void,
  disabled: boolean,
}

type SelectionFormState = {
  sheetOptions: { value: string, label: string }[],
  selectedOption: { value: string, label: string } | null,
}

class SelectionForm extends React.Component<SelectionFormProps, SelectionFormState> {
  private readonly fileInput: React.RefObject<HTMLInputElement>;

  constructor(props: SelectionFormProps) {
    super(props);
    this.state = {
      sheetOptions: [],
      selectedOption: null,
    }
    this.fileInput = React.createRef();
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.handleSheetChange = this.handleSheetChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  private handleFileInputChange(event: React.FormEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (file) {
      this.props.solver.setFile(file).then(sheetNames =>
        this.setState({
          sheetOptions: sheetNames.map(sheetName =>
            ({value: sheetName, label: sheetName})),
          selectedOption: null,
        })
      );
    }
  }

  private handleSheetChange(option: { value: string, label: string } | null) {
    this.setState({selectedOption: option})
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.props.onPlanRotaSheet(this.state.selectedOption!.value);
  }
}

export default SelectionForm;