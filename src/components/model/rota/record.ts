import Excel from "exceljs";
import {Availability, Duty, Employee, Shift, Status, Task, Team} from "../domain";
import {AvailabilityField, ShiftField, TextField} from "./field";
import {Columns} from "./columns";

export class Record {
  private readonly teamField: TextField;
  private readonly nameField: TextField;
  private readonly shiftFields: ShiftField[];
  private readonly fishField: AvailabilityField;
  private readonly dsFields: AvailabilityField[];
  private readonly lateDSFields: AvailabilityField[];
  private readonly ssField: AvailabilityField;

  constructor(themeColors: string[], columns: Columns, row: Excel.Row) {
    this.teamField = new TextField(themeColors, row.getCell(columns.team));
    this.nameField = new TextField(themeColors, row.getCell(columns.name));

    this.shiftFields = Array(Shift.enumValues.length);
    // @ts-ignore
    for (const shift of Shift) {
      this.shiftFields[shift.enumOrdinal] = new ShiftField(themeColors, row.getCell(columns.shift(shift)));
    }

    this.fishField = new AvailabilityField(themeColors, row.getCell(columns.fish));

    this.dsFields = Array(Shift.enumValues.length);
    // @ts-ignore
    for (const shift of Shift) {
      this.dsFields[shift.enumOrdinal] = new AvailabilityField(themeColors, row.getCell(columns.ds(shift)));
    }

    this.lateDSFields = Array(Shift.enumValues.length / 2);
    // @ts-ignore
    for (const shift of Shift) {
      if (shift.enumOrdinal % 2 === 0) continue;
      this.lateDSFields[Math.trunc(shift.enumOrdinal / 2)]
        = new AvailabilityField(themeColors, row.getCell(columns.lateDS(shift)));
    }

    this.ssField = new AvailabilityField(themeColors, row.getCell(columns.ss));
  }

  get name() {
    return this.nameField.content;
  }

  createEmployee(): Employee {
    const name: string = this.nameField.content;
    const team: Team = Team.fromTitle(this.teamField.content)!;
    const statuses = this.shiftFields.map(field => field.status);

    const availability = new Availability();
    // @ts-ignore
    for (const shift of Shift) {
      availability.entries[shift.enumOrdinal][Duty.FISH.enumOrdinal] =
        this.fishField.available;
      availability.entries[shift.enumOrdinal][Duty.DS.enumOrdinal] =
        this.dsFields[shift.enumOrdinal].available;
      availability.entries[shift.enumOrdinal][Duty.LATE_DS.enumOrdinal] =
        this.lateDSFields[Math.trunc(shift.enumOrdinal / 2)].available;
      availability.entries[shift.enumOrdinal][Duty.SS.enumOrdinal] =
        this.ssField.available;
    }
    return new Employee(name, team, statuses, availability);
  }

  addPriorShiftsTo(employee: Employee) {
    // @ts-ignore
    for (const shift of Shift) {
      const status = this.shiftFields[shift.enumOrdinal].status;
      if (status === Status.AVAILABLE || status === Status.UNAVAILABLE || status === Status.WORKING_FROM_HOME) {
        employee.incrementPriorShifts();
      }
    }
  }

  addPriorTasksTo(employee: Employee) {
    // @ts-ignore
    for (const shift of Shift) {
      const status = this.shiftFields[shift.enumOrdinal].status;
      if (status === Status.AVAILABLE) {
        const duty = this.shiftFields[shift.enumOrdinal].duty;
        if (duty !== null) {
          employee.incrementPriorTasks();
        }
      }
    }
  }

  createTaskList(employee: Employee): Task[] {
    const taskList: Task[] = [];
    // @ts-ignore
    for (const shift of Shift) {
      const duty = this.shiftFields[shift.enumOrdinal].duty;
      if (duty !== null) {
        const task = new Task(duty, shift);
        task.employee = employee;
        taskList.push(task);
      }
    }
    return taskList;
  }

  enterTask(task: Task) {
    this.shiftFields[task.shift.enumOrdinal].duty = task.duty;
  }
}
