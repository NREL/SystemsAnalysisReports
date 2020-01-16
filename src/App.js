import React from 'react';
import { PeakZoneLoadReport } from './Reports/PeakZoneLoadReport';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Revit Systems Analysis - Loads Report
        </p>
      </header>
      <PeakZoneLoadReport/>
    </div>
  );
}

export default App;
