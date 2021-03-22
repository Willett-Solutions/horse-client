import Excel from "exceljs";
import {Preferences, Duty, Employee, Shift, Status, Task, Team} from "../domain";
import {PreferenceField, ShiftField, TextField} from "./field";
import {PrefsColumns, ShiftColumns} from "./columns";
import {PrefsTable} from "./table";

export class ShiftRecord {
  private readonly teamField: TextField;
  private readonly nameField: TextField;
  private readonly shiftFields: ShiftField[];

  constructor(themeColors: string[], columns: ShiftColumns, row: Excel.Row) {
    this.teamField = new TextField(themeColors, row.getCell(columns.team));
    this.nameField = new TextField(themeColors, row.getCell(columns.name));

    this.shiftFields = Array(Shift.enumValues.length);
    // @ts-ignore
    for (const shift of Shift) {
      this.shiftFields[shift.enumOrdinal] = new ShiftField(themeColors, row.getCell(columns.shift(shift)));
    }
  }

  get name() {
    return this.nameField.content;
  }

  createEmployee(prefsTable: PrefsTable): Employee {
    const name: string = this.nameField.content;
    const team: Team = Team.fromTitle(this.teamField.content)!;
    const statuses = this.shiftFields.map(field => field.status);

    const preferences = prefsTable.getPreferences(name);
    return new Employee(name, team, statuses, preferences);
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
          employee.priorTaskCount++;
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
  private readonly fishField: PreferenceField;
  private readonly dsFields: PreferenceField[];
  private readonly lateDSFields: PreferenceField[];
  private readonly ssField: PreferenceField;

  constructor(columns: PrefsColumns, row: Excel.Row) {
    this.teamField = new TextField([], row.getCell(columns.team));
    this.nameField = new TextField([], row.getCell(columns.name));

    this.fishField = new PreferenceField(row.getCell(columns.fish));

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

    this.ssField = new PreferenceField(row.getCell(columns.ss));
  }

  get name() {
    return this.nameField.content;
  }

  getPreferences(): Preferences {
    const preferences = new Preferences();
    // @ts-ignore
    for (const shift of Shift) {
      preferences.set(shift, Duty.FISH, this.fishField.canDo);
      preferences.set(shift, Duty.DS, this.dsFields[shift.enumOrdinal].canDo);
      preferences.set(shift, Duty.LATE_DS, this.lateDSFields[Math.trunc(shift.enumOrdinal / 2)].canDo);
      preferences.set(shift, Duty.SS, this.ssField.canDo);
    }
    return preferences;
  }
}
