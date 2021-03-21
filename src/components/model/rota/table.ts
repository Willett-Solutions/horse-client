import Excel from "exceljs";
import {Employee, Task, Team} from "../domain";
import {Record} from "./record";
import {Columns} from "./columns";

export class Table {
  private records: Record[] = [];

  constructor(themeColors: string[], sheet: Excel.Worksheet) {
    const columns = new Columns(sheet);
    sheet.eachRow(row => {
      const teamName = row.getCell(columns.team).text;
      if (Team.exists(teamName)) {
        this.records.push(new Record(themeColors, columns, row));
      }
    });
  }

  createEmployees(): Employee[] {
    return this.records.map(record => record.createEmployee());
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

  private findRecord(name: string): Record | undefined {
    return this.records.find(record => record.name === name);
  }
}
