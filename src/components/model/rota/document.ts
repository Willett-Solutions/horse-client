import Excel from "exceljs";
import {Roster} from "../domain";
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
    const roster = Document.getRoster(this.workbook.getWorksheet(sheetName));
    console.log(roster);

    // Simulate wait for solving
    await new Promise(resolve => setTimeout(resolve, 5000));

    const buffer = await this.workbook.xlsx.writeBuffer();
    return new File([buffer], this.file!.name, {type: this.file!.type});
  }

  private static getRoster(sheet: Excel.Worksheet): Roster {
    const table = new Table(sheet);
    const employeeList = table.createEmployeeList();
    const taskList = table.createTaskList(employeeList);
    return new Roster(employeeList, taskList);
  }
}
