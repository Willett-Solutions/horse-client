import Excel from "exceljs";
import {Duty, Roster, Shift, Task} from "../domain";
import {Table} from "./table";

export class Document {
  private file: File | null = null;
  private workbook: Excel.Workbook;

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
    const table = new Table(this.workbook.getWorksheet(sheetName));
    const problem = Document.getRoster(table);
    const response = await fetch("http://localhost:8080/solve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(problem),
    });
    const body = await response.json();
    const solution = new Roster(body.employeeList, body.taskList);  // Ugly!
    console.log(solution);
    Document.setRoster(table, solution);

    const buffer = await this.workbook.xlsx.writeBuffer();
    return new File([buffer], this.file!.name, {type: this.file!.type});
  }

  private static getRoster(table: Table): Roster {
    const employeeList = table.createEmployeeList();
    const taskList = table.createTaskList(employeeList);
    this.addUnassignedTasks(taskList);
    return new Roster(employeeList, taskList);
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

  private static setRoster(table: Table, roster: Roster) {
    roster.taskList.forEach(task => table.enterTask(task));
  }
}
