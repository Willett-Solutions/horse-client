import {Duty, Shift, Task} from "./task";
import {Employee, Team} from "./employee";
import {ShiftTable} from "../rota/table";

/**
 * All the data constituting a problem for solution by Optaplanner.
 */

export class Roster {
  readonly employees: Employee[];
  readonly tasks: Task[];

  constructor(employees: Employee[], tasks: Task[]) {
    this.employees = employees;
    this.tasks = tasks;
  }

  static fromTable(table: ShiftTable): Roster {
    const employees = table.employees;
    const tasks = table.tasks;
    return new Roster(employees, tasks);
  }

  static fromJSON(text: string) {
    const body = JSON.parse(text, Roster.reviver);
    return new Roster(body.employees, body.tasks);
  }

  private static reviver(key: string, value: string) {
    switch (key) {
      case "team":
        return Team.enumValueOf(value);
      case "duty":
        return Duty.enumValueOf(value);
      case "shift":
        return Shift.enumValueOf(value);
      default:
        return value;
    }
  }
}
