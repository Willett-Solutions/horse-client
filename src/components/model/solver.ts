import * as Rota from "./rota";
import {Roster, Duty, Shift, Team} from "./domain";

class Solver {
  async solve(document: Rota.Document) {
    const problem = document.getRoster();
    problem.addUnassignedTasks();
    const authority = process.env.REACT_APP_AUTHORITY;
    const response = await fetch("http://" + authority + "/solve", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(problem),
    });
    const text = await response.text();
    const body = JSON.parse(text, Solver.reviver);
    const solution = new Roster(body.employees, body.tasks);  // Ugly!
    await document.setRoster(solution);
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

export default Solver;
