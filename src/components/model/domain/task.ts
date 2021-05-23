import {Enumify} from "enumify";
import Color from "color";
import {Employee} from "./employee";

export class Task {
  employee: Employee | null = null;

  constructor(readonly duty: Duty, readonly shift: Shift) {}
}

export class Duty extends Enumify {
  constructor(readonly color: Color) {
    super();
  }

  static FISH = new Duty(Color("#FF0000"));
  static DS = new Duty(Color("#00B0F0"));
  static LATE_DS = new Duty(Color("#0070C0"));
  static SS = new Duty(Color("#FFC000"));
  static _ = Duty.closeEnum();

  toJSON() {
    return this.enumKey;
  }

  static fromColor(color: Color): Duty | null {
    // @ts-ignore
    const duties: Duty[] = [...Duty];
    return duties.find(duty => duty.color.rgbNumber() === color.rgbNumber()) ?? null;
  }
}

export class Shift extends Enumify {
  static MONDAY_AM = new Shift();
  static MONDAY_PM = new Shift();
  static TUESDAY_AM = new Shift();
  static TUESDAY_PM = new Shift();
  static WEDNESDAY_AM = new Shift();
  static WEDNESDAY_PM = new Shift();
  static THURSDAY_AM = new Shift();
  static THURSDAY_PM = new Shift();
  static FRIDAY_AM = new Shift();
  static FRIDAY_PM = new Shift();
  static _ = Shift.closeEnum();

  toJSON() {
    return this.enumKey;
  }
}
