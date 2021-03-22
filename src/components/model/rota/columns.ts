import Excel from "exceljs";
import {Shift} from "../domain";

export class ShiftColumns {
  team = 1;
  name = 2;

  shift(shift: Shift): number {
    return 3 + shift.enumOrdinal;
  }
}


export class PrefsColumns {
  team = 1;
  name = 2;
  fish: number;
  ss: number;

  private readonly firstDSColumn: number;
  private readonly firstLateDSColumn: number;

  constructor(sheet: Excel.Worksheet) {
    this.fish = PrefsColumns.findColumn(sheet, "FISH");
    this.ss = PrefsColumns.findColumn(sheet, "SS");
    this.firstDSColumn = PrefsColumns.findColumn(sheet, "DS");
    this.firstLateDSColumn = PrefsColumns.findColumn(sheet, "Late DS");
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
