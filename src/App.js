import React from 'react';
import { Navbar } from './Components/Navbar';
import './App.css';
import jsonData from './complete_set.json';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Revit Systems Analysis - Loads Report
        </p>
      </header>
      <Navbar data={jsonData} />
    </div>
  );
}

export default App;
