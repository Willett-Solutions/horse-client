import React from "react";
import "./SummaryTable.css";

function SummaryTable(props: { summary: { [name: string]: number[] } }) {
  return (
    <React.Fragment>
      <h2 className="text-center p-3">Sessions assigned</h2>
      <table className="table table-bordered table-striped table-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>FISH</th>
            <th>DS</th>
            <th>Late DS</th>
            <th>SS</th>
          </tr>
        </thead>
        <tbody>
        {
          Object.entries(props.summary)
          .filter(([, counts]) => counts.some(count => count > 0))
          .map(([name, counts]) =>
            <tr>
              <td>{name}</td>
              {counts.map(count => <td>{count}</td>)}
            </tr>
          )
        }
        </tbody>
      </table>
    </React.Fragment>
  )
}

export default SummaryTable;
