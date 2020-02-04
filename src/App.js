import React from 'react';
import { TabPanes } from './Components/TabPanes';
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
          <TabPanes data={jsonData}/>
      </div>
    )
  }
}