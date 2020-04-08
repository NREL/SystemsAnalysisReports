This project provides output reports for Revit Systems Analysis.

## Available Scripts

For testing, you can create some simulated data by running the following command.

### `node ./scripts/generateJSON.js`

Move the created data.json file into the /src folder.

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production using Webpack 4 to the `build` folder.<br />
It bundles React in production mode and optimizes the build for the best performance.

The build is minified.  the data.json file is included in the bundle.js.<br />

This build can be run statically without the need for any web server.<br />