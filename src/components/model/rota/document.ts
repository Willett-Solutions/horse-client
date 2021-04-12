import assert from "assert";
import date from "date-and-time";
import Excel from "exceljs";
import {Employee, Roster} from "../domain";
import {PrefsTable, ShiftTable} from "./table";
import {ShiftRecord} from "./record";

export class Document {
  private readonly file: File;
  private readonly workbook: Excel.Workbook;
  private readonly themeColors: string[] = Array(2);
  private readonly prefsTable: PrefsTable;

  private activeTable: ShiftTable | null = null;

  static async build(file: File): Promise<Document> {
    const workbook = new Excel.Workbook();
    const buffer = await file.arrayBuffer();
    await workbook.xlsx.load(buffer);
    return new Document(file, workbook);
  }

  private constructor(file: File, workbook: Excel.Workbook) {
    this.file = file;
    this.workbook = workbook;
    this.setThemeColors();
    this.prefsTable = new PrefsTable(this.workbook.getWorksheet("Preferences"));
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

  get sheetNames(): string[] {
    return this.workbook.worksheets.map(sheet => sheet.name)
      .filter(sheetName => {
        const sheetDate = date.parse(sheetName, "DD-MM-YYYY");
        return !isNaN(sheetDate.getDate());
      });
  }

  setSheet(name: string) {
    this.activeTable = new ShiftTable(this.themeColors, this.workbook.getWorksheet(name));
  }

  getRoster(): Roster {
    assert(this.activeTable !== null);
    const employees = this.activeTable.createEmployees(this.prefsTable)
      .filter(employee => employee.canDoTasks());
    this.addShiftsAndTasksPriorTo(this.activeTable.sheetName, employees);
    const tasks = this.activeTable.createTasks(employees);
    const roster = new Roster(employees, tasks);
    roster.addUnassignedTasks();
    return roster;
  }

  getRecord(employee: Employee): ShiftRecord | undefined {
    return this.activeTable!.getRecord(employee);
  }

  async setRoster(solution: Roster) {
    this.workbook.eachSheet(worksheet => worksheet.removeConditionalFormatting(true));
    solution.tasks.forEach(task => this.activeTable!.enterTask(task));
  }

  async getFile(): Promise<File> {
    const buffer = await this.workbook.xlsx.writeBuffer();
    return new File([buffer], this.file.name, {type: this.file.type});
  }

  private addShiftsAndTasksPriorTo(sheetName: string, employees: Employee[]) {
    const thisSheetDate = date.parse(sheetName, "DD-MM-YYYY");
    this.workbook.eachSheet(sheet => {
      const sheetDate = date.parse(sheet.name, "DD-MM-YYYY");
      // Consider sheets dated up to 12 weeks (84 days) before this sheet
      const dateDifference = date.subtract(thisSheetDate, sheetDate).toDays();
      if (dateDifference > 0 && dateDifference <= 84) {
        const table = new ShiftTable(this.themeColors, sheet);
        table.addShiftsAndTasksTo(employees);
      }
    });
  }
}
