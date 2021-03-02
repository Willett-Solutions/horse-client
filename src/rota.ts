import Excel from "exceljs";

export class Document {
  private filename: string | null = null;
  private workbook: Excel.Workbook;

  constructor() {
    this.workbook = new Excel.Workbook();
  }

  async load(file: File): Promise<string[]> {
    this.filename = file.name;
    const buffer = await file.arrayBuffer();
    await this.workbook.xlsx.load(buffer);
    return this.workbook.worksheets.map(sheet => sheet.name);
  }

  async solve(sheetName: string): Promise<File> {
    console.log(sheetName);

    // Simulate wait for solving
    await new Promise(resolve => setTimeout(resolve, 5000));

    const buffer = await this.workbook.xlsx.writeBuffer();
    return new File([buffer], this.filename!, {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
  }
}
