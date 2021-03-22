import Excel from "exceljs";
import date from 'date-and-time';
import {Employee, Roster} from "../domain";
import {PrefsTable, ShiftTable} from "./table";

export class Document {
  private readonly workbook: Excel.Workbook;
  private themeColors: string[] = Array(2);
  private file: File | null = null;
  private shiftTable: ShiftTable | null = null;

  constructor() {
    this.workbook = new Excel.Workbook();
  }

  async load(file: File): Promise<string[]> {
    this.file = file;
    const buffer = await file.arrayBuffer();
    await this.workbook.xlsx.load(buffer);
    this.setThemeColors();
    return this.workbook.worksheets.map(sheet => sheet.name)
      .filter(sheetName => {
        const sheetDate = date.parse(sheetName, "DD-MM-YYYY");
        return !isNaN(sheetDate.getDate());
      });
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
    const prefsTable = new PrefsTable(this.workbook.getWorksheet("Preferences"));
    this.shiftTable = new ShiftTable(this.themeColors, this.workbook.getWorksheet(sheetName));
    const employees = this.shiftTable.createEmployees(prefsTable);
    this.addShiftsAndTasksPriorTo(sheetName, employees);
    const tasks = this.shiftTable.createTasks(employees);
    return new Roster(employees, tasks);
  }

  async setRoster(solution: Roster): Promise<File> {
    this.workbook.eachSheet(worksheet => worksheet.removeConditionalFormatting(true));
    solution.tasks.forEach(task => this.shiftTable!.enterTask(task));
    const buffer = await this.workbook.xlsx.writeBuffer();
    return new File([buffer], this.file!.name, {type: this.file!.type});
  }

  private addShiftsAndTasksPriorTo(sheetName: string, employees: Employee[]) {
    const thisSheetDate = date.parse(sheetName, "DD-MM-YYYY");
    this.workbook.eachSheet(sheet => {
      const sheetDate = date.parse(sheet.name, "DD-MM-YYYY");
      // Consider sheets dated up to 6 weeks (42 days) before this sheet
      const dateDifference = date.subtract(thisSheetDate, sheetDate).toDays();
      if (dateDifference > 0 && dateDifference <= 42) {
        const table = new ShiftTable(this.themeColors, sheet);
        table.addShiftsAndTasksTo(employees);
      }
    });
  }
}
