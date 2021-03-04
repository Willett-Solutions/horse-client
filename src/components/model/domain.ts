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

}

export class Employee {
  private readonly name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class Team extends Enumify {
  readonly name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }

  static PRINCIPALS = new Team("Principals");
  static AML_MDS = new Team("AML/MDS");
  static MPN_CML = new Team("MPN/CML");
  static LYMPHOID = new Team("Lymphoid");
  static _ = Team.closeEnum();

  static exists(name: string): boolean {
    // @ts-ignore
    const teams: Team[] = [...Team];
    return teams.find(team => team.name === name) !== undefined;
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
}
