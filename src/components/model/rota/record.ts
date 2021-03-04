import Excel from "exceljs";
import {Availability, Duty, Employee, Shift, Team} from "../domain";
import {TextField, ShiftField, AvailabilityField} from "./field";
import {Columns} from "./columns";

export class Record {
  private readonly teamField: TextField;
  private readonly nameField: TextField;
  private readonly shiftFields: ShiftField[];
  private readonly fishField: AvailabilityField;
  private readonly dsFields: AvailabilityField[];
  private readonly lateDSFields: AvailabilityField[];
  private readonly ssField: AvailabilityField;

  constructor(columns: Columns, row: Excel.Row) {
    this.teamField = new TextField(row.getCell(columns.team));
    this.nameField = new TextField(row.getCell(columns.name));

    this.shiftFields = Array(Shift.enumValues.length);
    // @ts-ignore
    for (const shift of Shift) {
      this.shiftFields[shift.enumOrdinal] = new ShiftField(row.getCell(columns.shift(shift)));
    }

    this.fishField = new AvailabilityField(row.getCell(columns.fish));

    this.dsFields = Array(Shift.enumValues.length);
    // @ts-ignore
    for (const shift of Shift) {
      this.dsFields[shift.enumOrdinal] = new AvailabilityField(row.getCell(columns.ds(shift)));
    }

    this.lateDSFields = Array(Shift.enumValues.length / 2);
    // @ts-ignore
    for (const shift of Shift) {
      if (shift.enumOrdinal % 2 === 0) continue;
      this.lateDSFields[Math.trunc(shift.enumOrdinal / 2)]
        = new AvailabilityField(row.getCell(columns.lateDS(shift)));
    }

    this.ssField = new AvailabilityField(row.getCell(columns.ss));
  }

  createEmployee(): Employee {
    const name: string = this.nameField.content;
    const team: Team = Team.fromName(this.teamField.content)!;

    const availability = new Availability();
    // @ts-ignore
    for (const shift of Shift) {
      availability.entries[shift.enumOrdinal][Duty.FISH.enumOrdinal] = this.fishField.available;
      availability.entries[shift.enumOrdinal][Duty.DS.enumOrdinal] = this.dsFields[shift.enumOrdinal].available;
      availability.entries[shift.enumOrdinal][Duty.LATE_DS.enumOrdinal]
        = this.lateDSFields[Math.trunc(shift.enumOrdinal / 2)].available;
      availability.entries[shift.enumOrdinal][Duty.SS.enumOrdinal] = this.ssField.available;
    }

    return new Employee(name, team, availability);
  }
}
