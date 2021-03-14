import assert from "assert";
import convert from "color-convert";
import Excel from "exceljs";
import {Duty, Status} from "../domain";


abstract class Field {
  private readonly themeColors: string[]
  private readonly cell: Excel.Cell;

  constructor(themeColors: string[], cell: Excel.Cell) {
    this.themeColors = themeColors;
    this.cell = cell;
  }

  get content() {
    return this.cell.text
  }

  private _color: string | null | undefined;

  protected get color(): string | null {
    if (this._color === undefined) {
      this._color = this.getColor();
    }
    return this._color;
  }

  protected set color(value) {
    assert(value !== null);
    this.cell.style = {
      ...this.cell.style,
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: {argb: "FF" + value.substring(1)},
      }
    }
    this._color = value;
  }

  private getColor(): string | null {
    const fill = this.cell.fill;
    if (fill.type !== "pattern") return null;
    switch (fill.pattern) {
      case "solid":
        return this.getSolidColor(fill.fgColor);
      case "none":
        return "#FFFFFF";
      default:
        return null;
    }
  }

  private getSolidColor(fgColor: Partial<Excel.Color>): string | null {
    if (fgColor.hasOwnProperty("argb")) {
      return "#" + fgColor.argb!.substring(2);
    }
    if (fgColor.hasOwnProperty("theme")) {
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
        return "#" + convert.hsl.hex(hsl);
      } else {
        return "#" + color;
      }
    }
    return null;
  }
}


export class TextField extends Field {

}


export class ShiftField extends Field {
  get status(): Status {
    if (this.color === null) return Status.UNAVAILABLE;
    const status = Status.fromColor(this.color);
    if (status !== null) return status;
    if (ShiftField.isShadeOfGray(this.color) || this.content === "A/L") return Status.ANNUAL_LEAVE;
    if (Duty.fromColor(this.color) !== null) return Status.AVAILABLE;
    return Status.UNAVAILABLE;
  }

  get duty(): Duty | null {
    return this.color === null ? null : Duty.fromColor(this.color);
  }

  set duty(value) {
    assert(value !== null);
    this.color = value.color;
  }

  private static isShadeOfGray(color: string) {
    return convert.hex.rgb(color.substring(1)).every((val, i, arr) => val === arr[0]);
  }
}


export class AvailabilityField extends Field {
  get available(): boolean {
    return this.content === "Y";
  }
}
