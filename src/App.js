import React from 'react';
import { Navbar } from './Components/Navbar';
import './App.css';
import jsonData from './data.json';

export default class App extends React.Component {

  shiftReturnAirLoads(data) {
    // This function shifts the return air loads from lighting and equipment to new table rows "return_air_lighting" and "return_air_other"

    // Initialize new data objects
    data['return_air_lights'] = {
      "latent": 0.0,
      "related_area": 0.0,
      "sensible_delayed": 0.0,
      "sensible_instant": 0.0,
      "sensible_return_air": 0.0,
      "total": 0.0,
    };

    data["return_air_other"] = {
      "latent": 0.0,
      "related_area": 0.0,
      "sensible_delayed": 0.0,
      "sensible_instant": 0.0,
      "sensible_return_air": 0.0,
      "total": 0.0,
    };

    // Loop for row in data
    Object.keys(data).map((rowName) => {
      const returnAirLoad = JSON.parse(JSON.stringify(data))[rowName]['sensible_return_air'];
      const totalLoad = JSON.parse(JSON.stringify(data))[rowName]['total'];

      // If loads exist
      if (returnAirLoad > 0) {
        // Determine type of load (lighting or other)
        if ( rowName === 'lights') {
          // Lighting loads
          data["return_air_lights"]["sensible_instant"] = returnAirLoad;
          data["return_air_lights"]["total"] += returnAirLoad;         
        } else {
          // Increment all other loads
          data["return_air_other"]["sensible_instant"] += returnAirLoad;
          data["return_air_other"]["total"] += returnAirLoad;                    
        }

        // Remove sensible_return air load and reduce total load
        data[rowName]["sensible_return_air"] = 0;
        data[rowName]["total"] = Math.max(totalLoad-returnAirLoad,0);  
      }
      
      return data
    })

    return data
  }

  formatData(originalData) {
    // This function formats the data that will be displayed in the table.
    var newData = JSON.parse(JSON.stringify(originalData));

    // Adjust Zone Loads By Component
    newData['zone_loads_by_components'].map((loadObject) => {
      loadObject['cooling_peak_load_component_table'] = this.shiftReturnAirLoads(loadObject['cooling_peak_load_component_table']);
      loadObject['heating_peak_load_component_table'] = this.shiftReturnAirLoads(loadObject['heating_peak_load_component_table']);

      return loadObject;
    })

    // Adjust Systems Checksums
    newData['system_checksums'].map((loadObject) => {
      loadObject['cooling_peak_load_component_table'] = this.shiftReturnAirLoads(loadObject['cooling_peak_load_component_table']);
      loadObject['heating_peak_load_component_table'] = this.shiftReturnAirLoads(loadObject['heating_peak_load_component_table']);

      return loadObject;
    })

    return newData
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Revit Systems Analysis - Loads Report
          </p>
        </header>
        <Navbar data={this.formatData(jsonData)} />
      </div>
    )
  }
}