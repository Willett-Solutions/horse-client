import Excel from "exceljs";
import {Employee, Task, Team} from "../domain";
import {Record} from "./record";
import {Columns} from "./columns";

export class Table {
  private recordList: Record[] = [];

  constructor(themeColors: string[], sheet: Excel.Worksheet) {
    const columns = new Columns(sheet);
    sheet.eachRow(row => {
      const teamName = row.getCell(columns.team).text;
      if (Team.exists(teamName)) {
        this.recordList.push(new Record(themeColors, columns, row));
      }
    });
  }

  createEmployeeList(): Employee[] {
    return this.recordList.map(record => record.createEmployee());
  }

  addPriorShiftsTo(employeeList: Employee[]) {
    employeeList.forEach(employee => {
      this.findRecord(employee.name)?.addPriorShiftsTo(employee);
    });
  }

  addPriorTasksTo(employeeList:Employee[]) {
    employeeList.forEach(employee => {
      this.findRecord(employee.name)?.addPriorTasksTo(employee);
    });
  }

  createTaskList(employeeList: Employee[]): Task[] {
    const taskList: Task[][] = [];
    for (const employee of employeeList) {
      const record = this.findRecord(employee.name);
      if (record !== undefined) {
        taskList.push(record.createTaskList(employee));
      }
    }
    return taskList.flat();
  }

  enterTask(task: Task) {
    const record = this.findRecord(task.employee!.name);
    record?.enterTask(task);
  }

  private findRecord(name: string): Record | undefined {
    return this.recordList.find(record => record.name === name);
  }
}
