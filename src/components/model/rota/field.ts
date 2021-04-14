import assert from "assert";
import Excel from "exceljs";
import {Duty, Status} from "../domain";
import Color from "color";


abstract class Field {
  protected readonly cell: Excel.Cell;

  constructor(cell: Excel.Cell) {
    this.cell = cell;
  }
}


export class TextField extends Field {
  get text() {
    return this.cell.text;
  }
}


export class PreferenceField extends Field {
  get canDo(): boolean {
    return this.cell.text === "Y";
  }
}


abstract class ColoredField extends Field {
  private readonly themeColors: string[]

  constructor(themeColors: string[], cell: Excel.Cell) {
    super(cell);
    this.themeColors = themeColors;
  }

  private _color: Color | null | undefined;

  get color(): Color | null {
    if (this._color === undefined) {
      this._color = this.getColor();
    }
    return this._color;
  }

  set color(value) {
    assert(value !== null);
    this.cell.style = {
      ...this.cell.style,
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: {argb: "FF" + value.hex().substring(1)},
      }
    }
    this._color = value;
  }

  private getColor(): Color | null {
    const fill = this.cell.fill;
    if (fill.type !== "pattern") return null;
    switch (fill.pattern) {
      case "solid":
        return this.getSolidColor(fill.fgColor);
      case "none":
        return Color("#FFFFFF");
      default:
        return null;
    }
  }

  private getSolidColor(fgColor: Partial<Excel.Color>): Color {
    if (fgColor.hasOwnProperty("argb")) {
      return Color("#" + fgColor.argb!.substring(2));
    }
    if (fgColor.hasOwnProperty("theme")) {
      assert(fgColor.theme === 0 || fgColor.theme === 1);
      const color = Color("#" + this.themeColors[fgColor.theme]);
      if (fgColor.hasOwnProperty("tint")) {
        // @ts-ignore
        return color.lighten(fgColor.tint);
      }
      return color;
    }
    assert(false, "fgColor must have either argb or theme property");
  }
}


export class ShiftField extends ColoredField {
  get status(): Status {
    if (this.color === null) return Status.UNAVAILABLE;
    const status = Status.fromColor(this.color);
    if (status !== null) return status;
    if (ShiftField.isShadeOfGray(this.color) || this.cell.text === "A/L") return Status.ANNUAL_LEAVE;
    if (Duty.fromColor(this.color) !== null) return Status.AVAILABLE;
    return Status.UNAVAILABLE;
  }

  get duty(): Duty | null {
    return this.color === null ? null : Duty.fromColor(Color(this.color));
  }

  set duty(value) {
    assert(value !== null);
    this.color = value.color;
  }

  private static isShadeOfGray(color: Color) {
    return color.array().every((val, i, arr) => val === arr[0]);
  }
}
