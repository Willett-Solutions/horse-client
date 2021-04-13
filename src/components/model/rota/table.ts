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
    if (task.employee === null) return
    const record = this.findRecord(task.employee.name);
    record?.enterTask(task);
  }

  getRoster(): Roster {
    const employees = this.createEmployees(this.document.prefsTable)
      .filter(employee => employee.canDoTasks());
    this.document.addShiftsAndTasksPriorTo(this.sheetName, employees);
    const tasks = this.createTasks(employees);
    const roster = new Roster(employees, tasks);
    roster.addUnassignedTasks();
    return roster;
  }

  async setRoster(roster: Roster) {
    roster.tasks.forEach(task => this.enterTask(task));
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