import {ShiftTable} from "./rota/table";
import {Duty, Shift} from "./domain/task";

class Settings {
  getUnassignedTaskCount(table: ShiftTable): number {
    const taskCounts = Duty.enumValues.map(() => new Array(Shift.enumValues.length).fill(0));
    for (const task of table.tasks) {
      taskCounts[task.duty.enumOrdinal][task.shift.enumOrdinal]++;
    }
    let unassignedTaskCount = 0;
    for (const duty of Duty.enumValues) {
      for (const shift of Shift.enumValues) {
        unassignedTaskCount += Math.max(0,
          (duty as Duty).getTaskCount(shift as Shift) - taskCounts[duty.enumOrdinal][shift.enumOrdinal]);
      }
    }
    return unassignedTaskCount;
  }
}

export default Settings;
