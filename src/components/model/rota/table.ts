import assert from "assert";
import Excel from "exceljs";
import {Employee, Preferences, Roster, Task, Team} from "../domain";
import {Document} from "./document";
import {PrefsRecord, ShiftRecord} from "./record";
import {PrefsColumns, ShiftColumns} from "./columns";

export class ShiftTable {
  document: Document;
  sheetName: string;
  records: ShiftRecord[] = [];

  private _employees: Employee[] | undefined;

  constructor(document: Document, sheet: Excel.Worksheet) {
    this.document = document;
    this.sheetName = sheet.name;
    const columns = new ShiftColumns();
    sheet.eachRow(row => {
      const teamName = row.getCell(columns.team).text;
      if (Team.exists(teamName)) {
        this.records.push(new ShiftRecord(document.themeColors, columns, row));
      }
    });
  }

  get employees(): Employee[] {
    if (this._employees === undefined) {
      this._employees = this.records
        .map(record => record.createEmployee())
        .map(employee => {
          employee.preferences = this.document.preferences(employee);
          return employee;
        })
        .filter(employee => employee.canDoTasks());
      this.document.addShiftsAndTasksPriorTo(this.sheetName, this._employees);
    }
    return this._employees;
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

  applyRoster(roster: Roster) {
    roster.tasks.forEach(task => {
      if (task.employee !== null) {
        this.findRecord(task.employee.name)?.enterTask(task);
      }
    });
  }

  getRecord(employee: Employee): ShiftRecord | undefined {
    return this.findRecord(employee.name);
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