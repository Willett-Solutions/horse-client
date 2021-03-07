import Excel from "exceljs";
import {Enumify} from "enumify";
import assert from "assert";

export enum Status {
  AT_WORK,
  WORKING_FROM_HOME,
  ANNUAL_LEAVE,
  DOES_NOT_WORK
}

abstract class Field {
  protected cell: Excel.Cell;

  constructor(cell: Excel.Cell) {
    this.cell = cell;
  }
}

export class TextField extends Field {
  get content(): string {
    return this.cell.text;
  }
}

export class ShiftField extends Field {
  private getColor(): string | undefined {
    const fill: Excel.Fill = this.cell.fill;
    if (fill.type === "pattern") {
      switch (fill.pattern) {
        case "none":
          return "FFFFFFFF";
        case "solid": {
          const fgColor = fill.fgColor;
          if (fgColor.hasOwnProperty("argb")) {
            return fgColor.argb;
          } else if (fgColor.hasOwnProperty("theme")) {
            assert(fgColor.theme === 0);
            return "FFFFFFFF";
          } else {
            return undefined;
          }
        }
        default:
          return undefined;
      }
    } else {
      return undefined;
    }
  }

  get colorCode(): ColorCode | undefined {
    const color = this.getColor();
    if (color === undefined) return undefined;
    return ColorCode.fromColor(color);
  }

  set colorCode(value) {
    const color = value!.color;
    this.cell.style = {
      ...this.cell.style,
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: {argb: color},
      }
    }
  }

  get status(): Status {
    switch (this.colorCode) {
      case ColorCode.DOES_NOT_WORK:
        return Status.DOES_NOT_WORK;
      case ColorCode.ANNUAL_LEAVE:
        return Status.ANNUAL_LEAVE;
      case ColorCode.WORKING_FROM_HOME:
        return Status.WORKING_FROM_HOME;
      default:
        return Status.AT_WORK;
    }
  }
}

export class AvailabilityField extends Field {
  get available(): boolean {
    return this.cell.text === "Y";
  }
}

export class ColorCode extends Enumify {
  readonly color: string;

  constructor(color: string) {
    super();
    this.color = color;
  }

  static UNASSIGNED = new ColorCode("FFFFFFFF");
  static WORKING_FROM_HOME = new ColorCode("FF92D050");
  static ANNUAL_LEAVE = new ColorCode("FFBFBFBF");
  static DOES_NOT_WORK = new ColorCode("FF000000");
  static DUTY_FISH = new ColorCode("FFFF0000");
  static DUTY_DS = new ColorCode("FF00B0F0");
  static DUTY_LATE_DS = new ColorCode("FF0070C0");
  static DUTY_SS = new ColorCode("FFFFC000");
  static _ = ColorCode.closeEnum();

  static fromColor(color: string) {
    // @ts-ignore
    const colorCodes: ColorCode[] = [...ColorCode];
    return colorCodes.find(colorCode => colorCode.color === color);
  }
}
