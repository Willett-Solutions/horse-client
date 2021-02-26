import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <span>Haemato-</span><span>Oncology</span> <span>Rota</span> <span>Shift</span> <span>Evaluator</span>
        </p>
      </header>
      <ControlPanel/>
      <InstructionPanel/>
      <footer className="App-footer">
        <p>
          Version 0.0.0
        </p>
      </footer>
    </div>
  );
}

function ControlPanel() {
  return (
    <div className="App-panel">
      <p>Dummy</p>
    </div>
  );
}

function InstructionPanel() {
  return (
    <div className="App-panel">
      <p>Dummy</p>
    </div>
  );
}

export default App;
