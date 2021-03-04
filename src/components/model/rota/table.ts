import Excel from "exceljs";
import {Employee, Task, Team} from "../domain";
import {Record} from "./record";
import {Columns} from "./columns";

export class Table {
  private recordList: Record[] = [];

  constructor(sheet: Excel.Worksheet) {
    const columns = new Columns(sheet);
    sheet.eachRow(row => {
      const teamName = row.getCell(columns.team).text;
      if (Team.exists(teamName)) {
        this.recordList.push(new Record(columns, row));
      }
    });
  }

  createEmployeeList(): Array<Employee> {
    return this.recordList.map(record => record.createEmployee());
  }

  createTaskList(): Array<Task> {
    return [];
  }
}
