import * as Rota from "./rota";
import {Roster} from "./domain";

class Solver {
  async solve(table: Rota.ShiftTable) {
    const problem = Roster.fromTable(table);
    const authority = process.env.REACT_APP_AUTHORITY;
    const response = await fetch("http://" + authority + "/solve", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(problem),
    });
    const text = await response.text();
    const solution = Roster.fromJSON(text);
    table.applyRoster(solution);
  }
}

export default Solver;
