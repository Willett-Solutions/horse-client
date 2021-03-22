import Excel from "exceljs";
import {Employee, Preferences, Task, Team} from "../domain";
import {PrefsRecord, ShiftRecord} from "./record";
import {PrefsColumns, ShiftColumns} from "./columns";
import assert from "assert";

export class ShiftTable {
  private records: ShiftRecord[] = [];

  constructor(themeColors: string[], sheet: Excel.Worksheet) {
    const columns = new ShiftColumns();
    sheet.eachRow(row => {
      const teamName = row.getCell(columns.team).text;
      if (Team.exists(teamName)) {
        this.records.push(new ShiftRecord(themeColors, columns, row));
      }
    });
  }

  createEmployees(prefsTable: PrefsTable): Employee[] {
    return this.records.map(record => record.createEmployee(prefsTable));
  }

  addShiftsAndTasksTo(employees: Employee[]): void {
    employees.forEach(employee => {
      const record = this.findRecord(employee.name);
      record?.addPriorShiftsTo(employee);
      record?.addPriorTasksTo(employee);
    });
  }

  createTasks(employees: Employee[]): Task[] {
    const tasks: Task[][] = [];
    for (const employee of employees) {
      const record = this.findRecord(employee.name);
      if (record !== undefined) {
        tasks.push(record.createTasks(employee));
      }
    }
    return tasks.flat();
  }

  enterTask(task: Task) {
    const record = this.findRecord(task.employee!.name);
    record?.enterTask(task);
  }

  private findRecord(name: string): ShiftRecord | undefined {
    return this.records.find(record => record.name === name);
  }
}


export class PrefsTable {
  private records: PrefsRecord[] = [];

  constructor(sheet: Excel.Worksheet) {
    const columns = new PrefsColumns(sheet);
    sheet.eachRow(row => {
      const teamName = row.getCell(columns.team).text;
      if (Team.exists(teamName)) {
        this.records.push(new PrefsRecord(columns, row));
      }
    });
  }

  getPreferences(employeeName: string): Preferences {
    const record = this.records.find(record => record.name === employeeName);
    assert(record !== undefined);
    return record.getPreferences();
  }
}