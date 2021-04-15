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
    const employees = table.createEmployees()
      .map(employee => {
        employee.preferences = table.document.preferences(employee);
        return employee;
      })
      .filter(employee => employee.canDoTasks());
    table.document.addShiftsAndTasksPriorTo(table.sheetName, employees);
    const tasks = table.createTasks(employees);
    const roster = new Roster(employees, tasks);
    roster.addUnassignedTasks();
    return roster;
  }

  private addUnassignedTasks() {
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

  getUnassignedTaskCount(): number {
    return this.tasks.filter(task => task.employee === null).length;
  }
}
