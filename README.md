This project provides output reports for Revit Systems Analysis.

## Available Scripts

For testing, you can create some simulated data by running the following command.

### `node ./scripts/generateJSON.js`

Move the created data.json file into the /src folder. *After doing so be sure to return the data.json in /src to the snippet below before doing a build:*
```json
{
    "design_psychrometrics": {}, "system_load_summarys": {}, "zone_load_summarys": {}
}
```

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

### `unit conversions`

Unit conversions use the library [convert-units](https://github.com/ben-ng/convert-units).

### `Building the measure`

This step hasn't been automated yet, but after running npm run build:
- The files in build need to be moved to measure/systems_analysis_report_generator/resources/build.
- index.html must reference the bundle as systems_analysis_report_generator_report_bundle.js, this is due to logic baked into the openstudio-workflow gem.

It should also be noted that any push to master currently triggers a push to develop on gbxml-to-openstudio.