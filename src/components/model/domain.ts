import {Enumify} from "enumify";

export class Roster {
  private readonly employeeList: Employee[];
  private readonly taskList: Task[];

  constructor(employeeList: Employee[], taskList: Task[]) {
    this.employeeList = employeeList;
    this.taskList = taskList;
  }
}

export class Task {
  readonly duty: Duty;
  readonly shift: Shift;

  employee: Employee | null = null;
  isPinned: boolean = false;

  constructor(duty: Duty, shift: Shift) {
    this.duty = duty;
    this.shift = shift;
  }
}

export class Employee {
  readonly name: string;
  private readonly team: Team;
  private readonly availability: Availability;

  constructor(name: string, team: Team, availability: Availability) {
    this.name = name;
    this.team = team;
    this.availability = availability;
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

  static fromTitle(title: string): Team | undefined{
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
  private readonly tasksPerShift: number[];

  constructor(tasksPerShift: number[]) {
    super();
    this.tasksPerShift = tasksPerShift;
  }

  static FISH = new Duty([1, 1, 1, 1, 2, 2, 1, 1, 1, 1]);
  static DS = new Duty([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  static LATE_DS = new Duty([0, 0, 0, 0, 0, 1, 0, 1, 0, 1]);
  static SS = new Duty([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  static _ = Duty.closeEnum();

  getNumTasks(shift: Shift): number {
    return this.tasksPerShift[shift.enumOrdinal];
  }

  toJSON() {
    return this.enumKey;
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
