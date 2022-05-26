## Installation Instructions

1. Ensure you have Node v15.14.0 installed.

1. After cloning the repository, run `npm i` in the root of the repository to install dependencies.

### Using the Application:

In the command line, pass in the following arugments in this specific order, to generate the JSON data from the CSV files:

**{path-to-courses-file} {path-to-students-file} {path-to-tests-file} {path-to-marks-file} {path-to-output-file}
Example: “node app.js Example1/courses.csv Example1/students.csv Example1/tests.csv Example1/marks.csv output.json”**

_- You can type `--help` as an argument (anywhere after "node app.js") in the command line to see these intructions again._

If you do not pass in the required arguments, you will see an error message in the command line similar to this:

You need to pass these following arguments: <br>
{path-to-courses-file} {path-to-students-file} {path-to-tests-file} {path-to-marks-file} {path-to-output-file} <br>
Example: “node app.js courses.csv students.csv tests.csv marks.csv output.json” <br>
Options: <br>
--version Show version number [boolean] <br>
--help Show help [boolean] <br>
Not enough non-option arguments: got 4, need at least 5

## Testing Instructions

Testing for this application is done using Mocha and Chai.

To run tests: `npm run test`

_Note: The files in the Example3 and Example4 directories are for testing invalid course weights and empty CSV files._

## Dependencies

- Csv-parser: 3.0.0
- Yargs: 17.3.1

## devDependencies

- Chai: 4.3.6,
- Mocha: 9.2.1
