import Excel from "exceljs";
import date from 'date-and-time';
import {Duty, Employee, Roster, Shift, Task, Team} from "../domain";
import {Table} from "./table";

export class Document {
  private workbook: Excel.Workbook;
  private file: File | null = null;
  private table: Table | null = null;

  constructor() {
    this.workbook = new Excel.Workbook();
  }

  async load(file: File): Promise<string[]> {
    this.file = file;
    const buffer = await file.arrayBuffer();
    await this.workbook.xlsx.load(buffer);
    return this.workbook.worksheets.map(sheet => sheet.name);
  }

  async solve(sheetName: string): Promise<File> {
    this.table = new Table(this.workbook, sheetName);
    const problem = this.getRoster();
    const response = await fetch("http://localhost:8080/solve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(problem),
    });
    const text = await response.text();
    const body = JSON.parse(text, Document.reviver);
    const solution = new Roster(body.employeeList, body.taskList);  // Ugly!
    this.setRoster(solution);

    const buffer = await this.workbook.xlsx.writeBuffer();
    return new File([buffer], this.file!.name, {type: this.file!.type});
  }

  private static reviver(key: string, value: string) {
    switch (key) {
      case "team":
        return Team.enumValueOf(value);
      case "duty":
        return Duty.enumValueOf(value);
      case "shift":
        return Shift.enumValueOf(value);
      default:
        return value;
    }
  }

  private getRoster(): Roster {
    const employeeList = this.createEmployeeList();
    const taskList = this.table!.createTaskList(employeeList);
    Document.addUnassignedTasks(taskList);
    return new Roster(employeeList, taskList);
  }

  private createEmployeeList(): Employee[] {
    const employeeList = this.table!.createEmployeeList();
    this.table!.addPriorShiftsTo(employeeList);
    this.workbook.eachSheet(sheet => {
      const sheetName = sheet.name;
      const sheetDate = date.parse(sheetName, "DD-MM-YYYY");
      if (sheetDate < new Date()) {
        const table = new Table(this.workbook, sheetName);
        table.addPriorShiftsTo(employeeList);
        table.addPriorTasksTo(employeeList);
      }
    });
    return employeeList;
  }

  private static addUnassignedTasks(taskList: Task[]) {
    // @ts-ignore
    for (const duty of Duty) {
      // @ts-ignore
      for (const shift of Shift) {
        const tasksRequired: number = duty.getNumTasks(shift);
        const tasksPresent = taskList.filter(task => task.duty === duty && task.shift === shift).length;
        for (let i = 0; i < tasksRequired - tasksPresent; i++) {
          taskList.push(new Task(duty, shift));
        }
      }
    }
  }

  private setRoster(roster: Roster) {
    roster.taskList.forEach(task => this.table!.enterTask(task));
  }
}
