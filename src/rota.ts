import Excel from "exceljs";

export class Document {
  private workbook: Excel.Workbook;

  constructor() {
    this.workbook = new Excel.Workbook();
  }

  async load(file: File) {
    const buffer = await file.arrayBuffer();
    await this.workbook.xlsx.load(buffer);
    console.log(this.workbook.worksheets[0].name);
  }

  async solve() {
    // Simulate wait for solving
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}
