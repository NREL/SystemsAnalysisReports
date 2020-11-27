import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from './store/index'
import './index.css';
import App from './App';
import json from './data.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import lightGrayMediumDensityTheme from '@hig/theme-data/build/esm/lightGrayMediumDensityTheme';
import ThemeContext from '@hig/theme-context';

ReactDOM.render(
    <Provider>
        <ThemeContext.Provider value={lightGrayMediumDensityTheme}>
            <App json={json}/>
        </ThemeContext.Provider>
    </Provider>
, document.getElementById('root')
);
