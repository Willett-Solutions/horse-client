import Excel from "exceljs";
import date from 'date-and-time';
import {Employee, Roster} from "../domain";
import {Table} from "./table";

export class Document {
  private readonly workbook: Excel.Workbook;
  private themeColors: string[] = Array(2);
  private file: File | null = null;
  private table: Table | null = null;

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

  getRoster(sheetName: string): Roster {
    this.table = new Table(this.themeColors, this.workbook.getWorksheet(sheetName));
    const employeeList = this.createEmployeeList(sheetName);
    const taskList = this.table!.createTaskList(employeeList);
    return new Roster(employeeList, taskList);
  }

  async setRoster(solution: Roster): Promise<File> {
    this.workbook.eachSheet(worksheet => worksheet.removeConditionalFormatting(true));
    solution.taskList.forEach(task => this.table!.enterTask(task));
    const buffer = await this.workbook.xlsx.writeBuffer();
    return new File([buffer], this.file!.name, {type: this.file!.type});
  }

  private createEmployeeList(sheetName: string): Employee[] {
    const employeeList = this.table!.createEmployeeList();
    const thisSheetDate = date.parse(sheetName, "DD-MM-YYYY");
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
}
