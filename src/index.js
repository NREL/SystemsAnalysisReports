import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from './store/index'
import App from './App';
import json from './data.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactDOM.render(
    <Provider>
        <App json={json}/>
    </Provider>
, document.getElementById('root')
);
