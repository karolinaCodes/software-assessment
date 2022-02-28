## Notes for Evaluator

I was not able to complete this evaluation in one sitting. I was only able to complete it piecemeal as I have other obligations such as an internship and other assessments I had to complete. In addition, this assessment was to be completed for a certain job requisition that has now been closed and so I stopped working on this assessment when I found out about this but then decided to complete it and submit it anyways.

## Installation Instructions

1. After cloning the repository, run `npm i` in the root of the repository to install dependencies.

### Using the Application:

In the command line, pass in the following arugments in this specific order, to generate the JSON data from the CSV files:

**{path-to-courses-file} {path-to-students-file} {path-to-tests-file} {path-to-marks-file} {path-to-output-file}
Example: “node app.js Example1/courses.csv Example1/students.csv Example1/tests.csv Example1/marks.csv output.json”**

_- You can type `--help` as an argument (anywhere after "node app.js") in the command line to see these intructions again._

If you do not pass in the required arguments, you will see an error message in the command line similar to this:

**You need to pass these following arguments:
{path-to-courses-file} {path-to-students-file} {path-to-tests-file}
{path-to-marks-file} {path-to-output-file}
Example: “node app.js courses.csv students.csv tests.csv marks.csv output.json”
Options:
--version Show version number [boolean]
--help Show help [boolean]
Not enough non-option arguments: got 4, need at least 5**

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
