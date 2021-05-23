import {Duty, Shift, Task} from "./task";
import {Employee, Team} from "./employee";
import {ShiftTable} from "../rota/table";

/**
 * All the data constituting a problem for solution by Optaplanner.
 */

export class Roster {
  constructor(readonly employees: Employee[], readonly tasks: Task[]) {}

  static fromTable(table: ShiftTable): Roster {
    const employees = table.employees;
    const tasks = table.tasks;
    this.addUnassignedTasksTo(tasks);
    return new Roster(employees, tasks);
  }

  private static addUnassignedTasksTo(tasks: Task[]) {
    // @ts-ignore
    for (const duty of Duty) {
      // @ts-ignore
      for (const shift of Shift) {
        const tasksRequired = duty.getTaskCount(shift);
        const tasksPresent = tasks.filter(task => task.duty === duty && task.shift === shift).length;
        for (let i = 0; i < tasksRequired - tasksPresent; i++) {
          tasks.push(new Task(duty, shift));
        }
      }
    }
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
