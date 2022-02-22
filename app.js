// const {fetchRows} = require('./helpers.js');
const fs = require('fs');
const csv = require('csv-parser');
const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const argv = yargs(hideBin(process.argv))
  .help()
  .usage(
    'You need to pass these following arguments: \n {path-to-courses-file} {path-to-students-file} {path-to-tests-file} {path-to-marks-file} {path-to-output-file}\n Example: “node app.js courses.csv students.csv tests.csv marks.csv output.json”'
  )
  .demandCommand(5).argv;

const [coursesFile, studentsFile, testsFile, marksFile, outputFile] = argv._;

const courses = [];
const marks = [];
const students = [];
const tests = [];

new Promise((resolve, reject) => {
  // if error, reject
  fs.createReadStream(coursesFile)
    .pipe(csv())
    .on('data', row => {
      courses.push(row);
    })
    .on('end', () => {
      console.log('"courses.csv" parsed');
      fs.createReadStream(studentsFile)
        .pipe(csv())
        .on('data', row => {
          marks.push(row);
        })
        .on('end', () => {
          console.log('"marks.csv" parsed');
          fs.createReadStream(testsFile)
            .pipe(csv())
            .on('data', row => {
              students.push(row);
            })
            .on('end', () => {
              console.log('"students.csv" parsed');
              fs.createReadStream(marksFile)
                .pipe(csv())
                .on('data', row => {
                  tests.push(row);
                })
                .on('end', () => {
                  console.log('"marks.csv" parsed');
                  resolve('done');
                });
            });
        });
    });
}).then(res => {
  console.log(courses);
});

// myPromise.then(res => {
//   console.log(res.students[0]);
//   console.log({students: []});
// });

// console.log(JSON.stringify({students: [{}, {}]}));

// node app.js Example1/courses.csv Example1/students.csv Example1/tests.csv Example1/marks.csv output.json
