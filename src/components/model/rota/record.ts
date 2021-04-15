import Excel from "exceljs";
import {Preferences, Duty, Employee, Shift, Status, Task, Team} from "../domain";
import {PreferenceField, ShiftField, TextField} from "./field";
import {PrefsColumns, ShiftColumns} from "./columns";
import {PrefsTable} from "./table";

export class ShiftRecord {
  private readonly teamField: TextField;
  private readonly nameField: TextField;
  readonly shiftFields: ShiftField[];

  constructor(themeColors: string[], columns: ShiftColumns, row: Excel.Row) {
    this.teamField = new TextField(row.getCell(columns.team));
    this.nameField = new TextField(row.getCell(columns.name));

    this.shiftFields = Array(Shift.enumValues.length);
    // @ts-ignore
    for (const shift of Shift) {
      this.shiftFields[shift.enumOrdinal] = new ShiftField(themeColors, row.getCell(columns.shift(shift)));
    }
  }

  get name() {
    return this.nameField.text;
  }

  createEmployee(): Employee {
    const name: string = this.nameField.text;
    const team: Team = Team.fromTitle(this.teamField.text)!;
    const statuses = this.shiftFields.map(field => field.status);
    return new Employee(name, team, statuses);
  }

  addPriorShiftsTo(employee: Employee) {
    // @ts-ignore
    for (const shift of Shift) {
      const status = this.shiftFields[shift.enumOrdinal].status;
      if (status === Status.AVAILABLE || status === Status.UNAVAILABLE || status === Status.WORKING_FROM_HOME) {
        employee.priorShiftCount++;
      }
    }
  }

  addPriorTasksTo(employee: Employee) {
    // @ts-ignore
    for (const shift of Shift) {
      const status = this.shiftFields[shift.enumOrdinal].status;
      if (status === Status.AVAILABLE) {
        const duty = this.shiftFields[shift.enumOrdinal].duty;
        if (duty !== null) {
          employee.priorTaskCounts[duty.enumOrdinal]++;
        }
      }
    }
  }

  createTasks(employee: Employee): Task[] {
    const tasks: Task[] = [];
    // @ts-ignore
    for (const shift of Shift) {
      const duty = this.shiftFields[shift.enumOrdinal].duty;
      if (duty !== null) {
        const task = new Task(duty, shift);
        task.employee = employee;
        tasks.push(task);
      }
    }
    return tasks;
  }

  enterTask(task: Task) {
    this.shiftFields[task.shift.enumOrdinal].duty = task.duty;
  }
}


export class PrefsRecord {
  private readonly teamField: TextField;
  private readonly nameField: TextField;
  private readonly fishFields: PreferenceField[];
  private readonly dsFields: PreferenceField[];
  private readonly lateDSFields: PreferenceField[];
  private readonly ssFields: PreferenceField[];

  constructor(columns: PrefsColumns, row: Excel.Row) {
    this.teamField = new TextField(row.getCell(columns.team));
    this.nameField = new TextField(row.getCell(columns.name));

    this.fishFields = Array(Shift.enumValues.length);
    // @ts-ignore
    for (const shift of Shift) {
      this.fishFields[shift.enumOrdinal] = new PreferenceField(row.getCell(columns.fish(shift)));
    }

    this.dsFields = Array(Shift.enumValues.length);
    // @ts-ignore
    for (const shift of Shift) {
      this.dsFields[shift.enumOrdinal] = new PreferenceField(row.getCell(columns.ds(shift)));
    }

    this.lateDSFields = Array(Shift.enumValues.length / 2);
    // @ts-ignore
    for (const shift of Shift) {
      if (shift.enumOrdinal % 2 === 0) continue;
      this.lateDSFields[Math.trunc(shift.enumOrdinal / 2)]
        = new PreferenceField(row.getCell(columns.lateDS(shift)));
    }

    this.ssFields = Array(Shift.enumValues.length);
    // @ts-ignore
    for (const shift of Shift) {
      this.ssFields[shift.enumOrdinal] = new PreferenceField(row.getCell(columns.ss(shift)));
    }
  }

  get name() {
    return this.nameField.text;
  }

  getPreferences(): Preferences {
    const preferences = new Preferences();
    // @ts-ignore
    for (const shift of Shift) {
      preferences.set(shift, Duty.FISH, this.fishFields[shift.enumOrdinal].canDo);
      preferences.set(shift, Duty.DS, this.dsFields[shift.enumOrdinal].canDo);
      preferences.set(shift, Duty.LATE_DS, this.lateDSFields[Math.trunc(shift.enumOrdinal / 2)].canDo);
      preferences.set(shift, Duty.SS, this.ssFields[shift.enumOrdinal].canDo);
    }
    return preferences;
  }
}
