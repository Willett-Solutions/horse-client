import {Enumify} from "enumify";
import Color from "color";
import {Employee} from "./employee";

export class Task {
  readonly duty: Duty;
  readonly shift: Shift;

  employee: Employee | null = null;

  constructor(duty: Duty, shift: Shift) {
    this.duty = duty;
    this.shift = shift;
  }
}

export class Duty extends Enumify {
  readonly color: Color;
  private readonly tasksPerShift: number[];

  constructor(color: Color, tasksPerShift: number[]) {
    super();
    this.color = color;
    this.tasksPerShift = tasksPerShift;
  }

  static FISH =
    new Duty(Color("#FF0000"), [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  static DS =
    new Duty(Color("#00B0F0"), [1, 0, 1, 0, 1, 1, 1, 1, 1, 1]);
  static LATE_DS =
    new Duty(Color("#0070C0"), [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]);
  static SS =
    new Duty(Color("#FFC000"), [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  static _ = Duty.closeEnum();

  getTaskCount(shift: Shift): number {
    return this.tasksPerShift[shift.enumOrdinal];
  }

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
