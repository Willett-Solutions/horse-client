import Excel from "exceljs";
import {Employee, Shift, Team} from "../domain";
import {ShiftField, TextField} from "./field";
import {Columns} from "./columns";

export class Record {
  private readonly teamField: TextField;
  private readonly nameField: TextField;
  private readonly shiftFields: ShiftField[];
  private readonly fishField: TextField;
  private readonly dsFields: TextField[];
  private readonly lateDSFields: TextField[];
  private readonly ssField: TextField;

  constructor(columns: Columns, row: Excel.Row) {
    this.teamField = new TextField(row.getCell(columns.team));
    this.nameField = new TextField(row.getCell(columns.name));

    this.shiftFields = Array(Shift.enumValues.length);
    // @ts-ignore
    for (const shift of Shift) {
      this.shiftFields[shift.enumOrdinal] = new ShiftField(row.getCell(columns.shift(shift)));
    }

    this.fishField = new TextField(row.getCell(columns.fish));

    this.dsFields = Array(Shift.enumValues.length);
    // @ts-ignore
    for (const shift of Shift) {
      this.dsFields[shift.enumOrdinal] = new TextField(row.getCell(columns.ds(shift)));
    }

    this.lateDSFields = Array(Shift.enumValues.length / 2);
    // @ts-ignore
    for (const shift of Shift) {
      if (shift.enumOrdinal % 2 === 0) continue;
      this.lateDSFields[Math.trunc(shift.enumOrdinal / 2)] = new TextField(row.getCell(columns.lateDS(shift)));
    }

    this.ssField = new TextField(row.getCell(columns.ss));
  }

  createEmployee(): Employee {
    const team: Team = Team.fromName(this.teamField.content)!;
    return new Employee(this.nameField.content, team);
  }
}
