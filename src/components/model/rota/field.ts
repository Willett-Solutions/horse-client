import Excel from "exceljs";

abstract class Field {
  protected cell: Excel.Cell;

  constructor(cell: Excel.Cell) {
    this.cell = cell;
  }
}

export class TextField extends Field {
  get content(): string {
    return this.cell.text;
  }
}

export class ShiftField extends Field {

}

export class AvailabilityField extends Field {
  get available(): boolean {
    return this.cell.text === "Y";
  }
}
