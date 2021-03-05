import Excel from "exceljs";
import {Availability, Duty, Employee, Shift, Task, Team} from "../domain";
import {TextField, ShiftField, AvailabilityField, ColorCode} from "./field";
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

  get name() {
    return this.nameField.content;
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

  createTaskList(employee: Employee): Task[] {
    const taskList: Task[] = [];
    // @ts-ignore
    for (const shift of Shift) {
      const duty = this.getDuty(shift);
      if (duty !== null) {
        const task = new Task(duty, shift);
        task.employee = employee;
        task.isPinned = true;
        taskList.push(task);
      }
    }
    return taskList;
  }

  private getDuty(shift: Shift): Duty | null {
    const colorCode = this.shiftFields[shift.enumOrdinal].colorCode;
    switch (colorCode) {
      case ColorCode.DUTY_FISH:
        return Duty.FISH
      case ColorCode.DUTY_DS:
        return Duty.DS
      case ColorCode.DUTY_LATE_DS:
        return Duty.LATE_DS
      case ColorCode.DUTY_SS:
        return Duty.SS
    }
    return null;
  }
}
