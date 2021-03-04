import Excel from "exceljs";
import {Employee, Roster, Shift, Task, Team} from "./domain";

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
    const taskList = table.createTaskList();
    const employeeList = table.createEmployeeList();
    return new Roster(employeeList, taskList);
  }
}

class Table {
  private recordList: Record[] = [];

  constructor(sheet: Excel.Worksheet) {
    const columns = new Columns(sheet);
    sheet.eachRow(row => {
      const teamName = row.getCell(columns.team).text;
      if (Team.exists(teamName)) {
        this.recordList.push(new Record(columns, row));
      }
    });
  }

  createEmployeeList(): Array<Employee> {
    return this.recordList.map(record => record.createEmployee());
  }

  createTaskList(): Array<Task> {
    return [];
  }
}

class Record {
  private readonly teamField: TextField;
  private readonly nameField: TextField;
  private readonly shiftFields: ShiftField[];
  private readonly fishField: TextField;
  private readonly dsFields: TextField[];
  private readonly lateDSFields: TextField[];
  private readonly ssField: TextField;

  constructor(columns: Columns, row: Excel.Row) {
    this.teamField = new TextField(row.getCell(columns.team));
    this.nameField = new TextField(row.getCell(columns.name));

    this.shiftFields = Array(Shift.enumValues.length);
    // @ts-ignore
    for (const shift of Shift) {
      this.shiftFields[shift.enumOrdinal] = new ShiftField(row.getCell(columns.shift(shift)));
    }

    this.fishField = new TextField(row.getCell(columns.fish));

    this.dsFields = Array(Shift.enumValues.length);
    // @ts-ignore
    for (const shift of Shift) {
      this.dsFields[shift.enumOrdinal] = new TextField(row.getCell(columns.ds(shift)));
    }

    this.lateDSFields = Array(Shift.enumValues.length / 2);
    // @ts-ignore
    for (const shift of Shift) {
      if (shift.enumOrdinal % 2 === 0) continue;
      this.lateDSFields[Math.trunc(shift.enumOrdinal / 2)] = new TextField(row.getCell(columns.lateDS(shift)));
    }

    this.ssField = new TextField(row.getCell(columns.ss));
  }

  createEmployee(): Employee {
    return new Employee(this.nameField.content);
  }
}

abstract class Field {
  protected cell: Excel.Cell;

  constructor(cell: Excel.Cell) {
    this.cell = cell;
  }
}

class TextField extends Field {
  get content(): string {
    return this.cell.text;
  }
}

class ShiftField extends Field {

}

class Columns {
  team = 1;
  name = 2;
  fish: number;
  ss: number;

  private readonly firstDSColumn: number;
  private readonly firstLateDSColumn: number;

  constructor(sheet: Excel.Worksheet) {
    this.fish = Columns.findColumn(sheet, "FISH");
    this.ss = Columns.findColumn(sheet, "SS");
    this.firstDSColumn = Columns.findColumn(sheet, "DS");
    this.firstLateDSColumn = Columns.findColumn(sheet, "Late DS");
  }

  shift(shift: Shift): number {
    return 2 + shift.enumOrdinal;
  }

  ds(shift: Shift): number {
    return this.firstDSColumn + shift.enumOrdinal;
  }

  lateDS(shift: Shift): number {
    return this.firstLateDSColumn + Math.trunc(shift.enumOrdinal / 2);
  }

  private static findColumn(sheet: Excel.Worksheet, label: string): number {
    const values = sheet.getRow(1).values as Excel.CellValue[];
    return values.findIndex(value => value === label);
  }
}
