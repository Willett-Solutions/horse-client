import {Enumify} from "enumify";
import Color from "color";

export class Roster {
  readonly employees: Employee[];
  readonly tasks: Task[];

  constructor(employees: Employee[], tasks: Task[]) {
    this.employees = employees;
    this.tasks = tasks;
  }

  addUnassignedTasks() {
    // @ts-ignore
    for (const duty of Duty) {
      // @ts-ignore
      for (const shift of Shift) {
        const tasksRequired: number = duty.getTaskCount(shift);
        const tasksPresent = this.tasks.filter(task => task.duty === duty && task.shift === shift).length;
        for (let i = 0; i < tasksRequired - tasksPresent; i++) {
          this.tasks.push(new Task(duty, shift));
        }
      }
    }
  }

  summary(): { [name: string]: number[] } {
    const items = Object.assign({}, ...this.employees.map(employee => ({
      [employee.name]: new Array(4).fill(0)
    })));
    for (const task of this.tasks) {
      if (task.employee !== null) {
        items[task.employee.name][task.duty.enumOrdinal]++;
      }
    }
    return items;
  }
}

export class Task {
  readonly duty: Duty;
  readonly shift: Shift;

  employee: Employee | null = null;

  constructor(duty: Duty, shift: Shift) {
    this.duty = duty;
    this.shift = shift;
  }
}

export class Employee {
  readonly name: string;
  private readonly team: Team;
  private readonly statuses: Status[];
  private readonly preferences: Preferences;
  priorShiftCount = 0;
  priorTaskCount = 0;

  constructor(name: string, team: Team, statuses: Status[], preferences: Preferences) {
    this.name = name;
    this.team = team;
    this.statuses = statuses;
    this.preferences = preferences;
  }
}

export class Team extends Enumify {
  readonly title: string;

  constructor(title: string) {
    super();
    this.title = title;
  }

  static PRINCIPALS = new Team("Principals");
  static AML_MDS = new Team("AML/MDS");
  static MPN_CML = new Team("MPN/CML");
  static LYMPHOID = new Team("Lymphoid");
  static _ = Team.closeEnum();

  static exists(title: string): boolean {
    return Team.fromTitle(title) !== undefined
  }

  static fromTitle(title: string): Team | undefined {
    // @ts-ignore
    const teams: Team[] = [...Team];
    return teams.find(team => team.title === title);
  }

  toJSON() {
    return this.enumKey;
  }
}

export class Preferences {
  private readonly entries: boolean[][];

  constructor() {
    this.entries = Array(Shift.enumValues.length);
    // @ts-ignore
    for (const shift of Shift) {
      this.entries[shift.enumOrdinal] = Array(Duty.enumValues.length);
      // @ts-ignore
      for (const duty of Duty) {
        this.entries[shift.enumOrdinal][duty.enumOrdinal] = false;
      }
    }
  }

  set(shift: Shift, duty: Duty, value: boolean) {
    this.entries[shift.enumOrdinal][duty.enumOrdinal] = value;
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

export class Status extends Enumify {
  readonly color: Color | null;

  constructor(color: Color | null) {
    super();
    this.color = color;
  }

  static AVAILABLE = new Status(Color("#FFFFFF"));
  static UNAVAILABLE = new Status(null);
  static WORKING_FROM_HOME = new Status(Color("#92D050"));
  static ANNUAL_LEAVE = new Status(Color("#BFBFBF"));
  static DOES_NOT_WORK = new Status(Color("#000000"));
  static _ = Status.closeEnum();

  toJSON() {
    return this.enumKey;
  }

  static fromColor(color: Color): Status | null {
    // @ts-ignore
    const statuses: Status[] = [...Status];
    return statuses.find(status => status.color?.rgbNumber() === color.rgbNumber()) ?? null;
  }
}
