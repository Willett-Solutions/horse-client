import Excel, {CellValue} from "exceljs";
import {Shift, Team} from "./domain";

export class Document {
  private file: File | null = null;
  private workbook: Excel.Workbook;
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
    this.table = new Table(this.workbook.getWorksheet(sheetName));

    // Simulate wait for solving
    await new Promise(resolve => setTimeout(resolve, 5000));

    const buffer = await this.workbook.xlsx.writeBuffer();
    return new File([buffer], this.file!.name, {type: this.file!.type});
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
    console.log(this.recordList);
  }
}

class Record {
  private readonly teamField: Field;
  private readonly nameField: Field;
  private readonly fishField: Field;
  private readonly ssField: Field;
  private readonly dsFields: Field[];
  private readonly lateDSFields: Field[];

  constructor(columns: Columns, row: Excel.Row) {
    this.teamField = new Field(row.getCell(columns.team));
    this.nameField = new Field(row.getCell(columns.name));
    this.fishField = new Field(row.getCell(columns.fish));
    this.ssField = new Field(row.getCell(columns.ss));

    this.dsFields = Array(Shift.enumValues.length);
    // @ts-ignore
    for (const shift of Shift) {
      this.dsFields[shift.enumOrdinal] = new Field(row.getCell(columns.ds(shift)));
    }

    this.lateDSFields = Array(Shift.enumValues.length / 2);
    // @ts-ignore
    for (const shift of Shift) {
      if (shift.enumOrdinal % 2 === 0) continue;
      this.lateDSFields[Math.trunc(shift.enumOrdinal / 2)] = new Field(row.getCell(columns.lateDS(shift)));
    }
  }
}

class Field {
  private content: string;

  constructor(cell: Excel.Cell) {
    this.content = cell.text;
  }
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

  ds(shift: Shift): number {
    return this.firstDSColumn + shift.enumOrdinal;
  }

  lateDS(shift: Shift): number {
    return this.firstLateDSColumn + Math.trunc(shift.enumOrdinal / 2);
  }

  private static findColumn(sheet: Excel.Worksheet, label: string): number {
    const values = sheet.getRow(1).values as CellValue[];
    return values.findIndex(value => value === label);
  }
}
