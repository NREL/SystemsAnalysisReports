import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import jsonData from './data.json';

ReactDOM.render(<App data={jsonData} />, document.getElementById('root'));
