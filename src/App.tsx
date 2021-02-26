import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <p>
          <span>Haemato-</span><span>Oncology</span> <span>Rota</span> <span>Shift</span> <span>Evaluator</span>
        </p>
      </header>
      <ControlPanel/>
      <InstructionPanel/>
      <footer>
        <p>
          Version 0.0.0
        </p>
      </footer>
    </div>
  );
}

function ControlPanel() {
  return (
    <div className="Panel ControlPanel">
      <UploadForm/>
      <HorseAnimation/>
    </div>
  );
}

function UploadForm() {
  return (
    <form className="UploadForm">
      <label>
        File containing rota:
        <input type="file"/>
      </label>
      <label>
        Sheet to be planned:
        <input type="text"/>
      </label>
      <button type="submit">
        Upload file
      </button>
    </form>
  );
}

function HorseAnimation() {
  return (
    <img src="horse-start.gif" alt="Horse ready and waiting"/>
  );
}

function InstructionPanel() {
  return (
    <div className="Panel">
      <p>Instruction Panel</p>
    </div>
  );
}

export default App;
