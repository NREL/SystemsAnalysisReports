import React from 'react';
import { Navigation } from './Components/Navigation';
import './App.css';
import jsonData from './data.json';

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Revit Systems Analysis - Loads Report
          </p>
          </header>
          <Navigation data={jsonData}/>
      </div>
    )
  }
}