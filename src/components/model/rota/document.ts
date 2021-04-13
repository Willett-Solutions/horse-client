import date from "date-and-time";
import Excel from "exceljs";
import {Employee} from "../domain";
import {PrefsTable, ShiftTable} from "./table";

export class Document {
  private readonly file: File;
  private readonly workbook: Excel.Workbook;

  readonly themeColors: string[] = Array(2);
  readonly prefsTable: PrefsTable;
  readonly tables: ShiftTable[];

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
    this.tables = workbook.worksheets
      .filter(sheet => !isNaN(date.parse(sheet.name, "DD-MM-YYYY").getDate()))
      .map(sheet => new ShiftTable(this, sheet));
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

  addShiftsAndTasksPriorTo(sheetName: string, employees: Employee[]) {
    const thisSheetDate = date.parse(sheetName, "DD-MM-YYYY");
    this.tables.forEach(table => {
      const sheetDate = date.parse(table.sheetName, "DD-MM-YYYY");
      // Consider sheets dated up to 12 weeks (84 days) before this sheet
      const dateDifference = date.subtract(thisSheetDate, sheetDate).toDays();
      if (dateDifference > 0 && dateDifference <= 84) {
        table.addShiftsAndTasksTo(employees);
      }
    });
  }

  async getFile(): Promise<File> {
    this.workbook.eachSheet(worksheet => worksheet.removeConditionalFormatting(true));
    const buffer = await this.workbook.xlsx.writeBuffer();
    return new File([buffer], this.file.name, {type: this.file.type});
  }
}
