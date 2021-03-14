import {Enumify} from "enumify";

export class Roster {
  readonly employeeList: Employee[];
  readonly taskList: Task[];

  constructor(employeeList: Employee[], taskList: Task[]) {
    this.employeeList = employeeList;
    this.taskList = taskList;
  }

  summary(): { [name: string]: number[] } {
    const items = Object.assign({}, ...this.employeeList.map(employee => ({
      [employee.name]: new Array(4).fill(0)
    })));
    for (const task of this.taskList) {
      items[task.employee!.name][task.duty.enumOrdinal]++;
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
  private readonly availability: Availability;
  priorShifts = 0;
  priorTasks = 0;

  constructor(name: string, team: Team, statuses: Status[], availability: Availability) {
    this.name = name;
    this.team = team;
    this.statuses = statuses;
    this.availability = availability;
  }

  incrementPriorShifts() {
    this.priorShifts++;
  }

  incrementPriorTasks() {
    this.priorTasks++;
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

export class Availability {
  entries: boolean[][];

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
}

export class Duty extends Enumify {
  readonly color: string;
  private readonly tasksPerShift: number[];

  constructor(color: string, tasksPerShift: number[]) {
    super();
    this.color = color;
    this.tasksPerShift = tasksPerShift;
  }

  static FISH =
    new Duty("#FF0000", [1, 1, 1, 1, 2, 2, 1, 1, 1, 1]);
  static DS =
    new Duty("#00B0F0", [1, 0, 1, 0, 1, 1, 1, 1, 1, 1]);
  static LATE_DS =
    new Duty("#0070C0", [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]);
  static SS =
    new Duty("#FFC000", [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  static _ = Duty.closeEnum();

  getNumTasks(shift: Shift): number {
    return this.tasksPerShift[shift.enumOrdinal];
  }

  toJSON() {
    return this.enumKey;
  }

  static fromColor(color: string): Duty | null {
    // @ts-ignore
    const duties: Duty[] = [...Duty];
    return duties.find(duty => duty.color === color) ?? null;
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
  readonly color: string | null;

  constructor(color: string | null) {
    super();
    this.color = color;
  }

  static AVAILABLE = new Status("#FFFFFF");
  static UNAVAILABLE = new Status(null);
  static WORKING_FROM_HOME = new Status("#92D050");
  static ANNUAL_LEAVE = new Status("#BFBFBF");
  static DOES_NOT_WORK = new Status("#000000");
  static _ = Status.closeEnum();

  toJSON() {
    return this.enumKey;
  }

  static fromColor(color: string): Status | null {
    // @ts-ignore
    const statuses: Status[] = [...Status];
    return statuses.find(status => status.color === color) ?? null;
  }
}
