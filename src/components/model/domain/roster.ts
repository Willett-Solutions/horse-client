import {Duty, Shift, Task} from "./task";
import {Employee} from "./employee";

export class Roster {
  readonly employees: Employee[];
  readonly tasks: Task[];

  constructor(employees: Employee[], tasks: Task[]) {
    this.employees = employees;
    this.tasks = tasks;
  }

  getUnassignedTaskCount(): number {
    return this.tasks.filter(task => task.employee === null).length;
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
}
