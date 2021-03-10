import assert from "assert";
import convert from "color-convert";
import Excel from "exceljs";
import {Enumify} from "enumify";
import {Duty} from "../domain";

export enum Status {
  AT_WORK,
  WORKING_FROM_HOME,
  ANNUAL_LEAVE,
  DOES_NOT_WORK
}

abstract class Field {
  protected themeColors: string[]
  protected cell: Excel.Cell;

  constructor(themeColors: string[], cell: Excel.Cell) {
    this.cell = cell;
    this.themeColors = themeColors;
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
            assert (fgColor.theme === 0 || fgColor.theme === 1);
            const color = this.themeColors[fgColor.theme];
            if (fgColor.hasOwnProperty("tint")) {
              // @ts-ignore
              const tint = fgColor.tint;
              const hsl = convert.hex.hsl(color);
              if (tint < 0) {
                hsl[2] = hsl[2] * (1 + tint);
              } else if (tint > 0) {
                hsl[2] = hsl[2] * (1 - tint) + (255 - 255 * (1 - tint));
              }
              return convert.hsl.hex(hsl);
            }
            else {
              return color;
            }
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
    let colorCode = ColorCode.fromColor(color);
    if (colorCode !== undefined) return colorCode;
    if (ShiftField.isShadeOfGray(color)) return ColorCode.ANNUAL_LEAVE;
    return undefined;
  }

  private static isShadeOfGray(color: string) {
    return convert.hex.rgb(color).every((val, i, arr) => val === arr[0]);
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

  get duty(): Duty | null {
    switch (this.colorCode) {
      case ColorCode.DUTY_FISH:
        return Duty.FISH;
      case ColorCode.DUTY_DS:
        return Duty.DS;
      case ColorCode.DUTY_LATE_DS:
        return Duty.LATE_DS;
      case ColorCode.DUTY_SS:
        return Duty.SS;
      default:
        return null;
    }
  }

  set duty(value) {
    switch (value) {
      case Duty.FISH:
        this.colorCode = ColorCode.DUTY_FISH;
        break;
      case Duty.DS:
        this.colorCode = ColorCode.DUTY_DS;
        break;
      case Duty.LATE_DS:
        this.colorCode = ColorCode.DUTY_LATE_DS;
        break;
      case Duty.SS:
        this.colorCode = ColorCode.DUTY_SS;
        break;
      default:
        this.colorCode = ColorCode.UNASSIGNED;
    }
  }
}

export class AvailabilityField extends Field {
  get available(): boolean {
    return this.cell.text === "Y";
  }
}

class ColorCode extends Enumify {
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
