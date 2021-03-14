import Excel from "exceljs";
import date from 'date-and-time';
import {Duty, Employee, Roster, Shift, Task, Team} from "../domain";
import {Table} from "./table";

export class Document {
  private readonly workbook: Excel.Workbook;
  private themeColors: string[] = Array(2);
  private file: File | null = null;
  private table: Table | null = null;
  private sheetName: string | null = null;
  solution: Roster | null = null;

  constructor() {
    this.workbook = new Excel.Workbook();
  }

  async load(file: File): Promise<string[]> {
    this.file = file;
    const buffer = await file.arrayBuffer();
    await this.workbook.xlsx.load(buffer);
    this.setThemeColors();
    return this.workbook.worksheets.map(sheet => sheet.name);
  }

  private setThemeColors() {
    const themes = this.workbook.model.themes;
    // @ts-ignore
    const theme = themes["theme1"];
    const parser = new DOMParser();
    const themeXml = parser.parseFromString(theme, "text/xml");
    const lt1 = themeXml.getElementsByTagName("a:lt1")[0];
    this.themeColors[0] = lt1.getElementsByTagName("a:sysClr")[0].getAttribute("lastClr")!;
    const dk1 = themeXml.getElementsByTagName("a:dk1")[0];
    this.themeColors[1] = dk1.getElementsByTagName("a:sysClr")[0].getAttribute("lastClr")!;
  }

  async solve(sheetName: string) {
    this.sheetName = sheetName;
    this.table = new Table(this.themeColors, this.workbook.getWorksheet(sheetName));
    const problem = this.getRoster();
    const authority = process.env.REACT_APP_AUTHORITY;
    const response = await fetch("http://" + authority + "/solve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(problem),
    });
    const text = await response.text();
    const body = JSON.parse(text, Document.reviver);
    this.solution = new Roster(body.employeeList, body.taskList);  // Ugly!
    this.workbook.eachSheet(worksheet => worksheet.removeConditionalFormatting(true))
    this.setRoster(this.solution);
  }

  async write(): Promise<File> {
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
    const thisSheetDate = date.parse(this.sheetName!, "DD-MM-YYYY");
    this.workbook.eachSheet(sheet => {
      const sheetDate = date.parse(sheet.name, "DD-MM-YYYY");
      // Consider sheets dated up to 6 weeks (42 days) before this sheet
      const dateDifference = date.subtract(thisSheetDate, sheetDate).toDays();
      if (dateDifference > 0 && dateDifference <= 42) {
        const table = new Table(this.themeColors, sheet);
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
