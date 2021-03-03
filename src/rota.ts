import Excel from "exceljs";
import {Enumify} from "enumify";

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

  constructor(columns: Columns, row: Excel.Row) {
    this.teamField = new Field(row.getCell(columns.team));
    this.nameField = new Field(row.getCell(columns.name));
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

  constructor(sheet: Excel.Worksheet) {

  }
}

class Team extends Enumify {
  readonly name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }

  static PRINCIPALS = new Team("Principals");
  static AML_MDS = new Team("AML/MDS");
  static MPN_CML = new Team("MPN/CML");
  static LYMPHOID = new Team("Lymphoid");
  static _ = Team.closeEnum();

  static exists(name: string): boolean {
    // @ts-ignore
    const teams: Team[] = [...Team];
    return teams.find(team => team.name === name) !== undefined;
  }
}
