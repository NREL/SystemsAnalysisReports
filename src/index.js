import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from './store/index'
import './index.css';
import App from './App';
import json from './data.json';



ReactDOM.render(
    <Provider>
        <App json={json} />
    </Provider>
, document.getElementById('root')
);
