const {
  deepClone,
  calcCourseAvg,
  calcTotalAverage,
  parseCsvFile,
} = require('./helpers');

const fs = require('fs');
const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const argv = yargs(hideBin(process.argv))
  .help()
  .usage(
    'You need to pass these following arguments: \n {path-to-courses-file} {path-to-students-file} {path-to-tests-file} {path-to-marks-file} {path-to-output-file}\n Example: “node app.js courses.csv students.csv tests.csv marks.csv output.json”'
  )
  .demandCommand(5).argv;

const [
  coursesFilePath,
  studentsFilePath,
  testsFilePath,
  marksFilePath,
  outputFilePath,
] = argv._;

const courses = [];
const marks = [];
const students = [];
const tests = [];

Promise.all(
  [
    parseCsvFile(coursesFilePath, courses),
    parseCsvFile(studentsFilePath, students),
    parseCsvFile(testsFilePath, tests),
    parseCsvFile(marksFilePath, marks),
  ],
  () => {
    // for each student: create an object with student info and an array of courses and then each course average and finally totalAverage of all courses
    students.forEach(student => {
      // all tests a student did
      const testsIdsForStudent = deepClone(marks)
        .filter(mark => mark.student_id === student.id)
        .map(mark => mark.test_id);

      // all marks for student
      const marksForStudent = deepClone(marks)
        .filter(mark => mark.student_id === student.id)
        .map(mark => mark.mark);

      // courses
      // get tests from certain student
      // get course_ids from arr
      // filter out the duplicate courses_id's
      const courseIdsforStudent = deepClone(tests)
        .filter(test => testsIdsForStudent.includes(test.id))
        .map(test => test.course_id)
        .filter((value, index, self) => self.indexOf(value) === index);

      const coursesForStudent = deepClone(courses).filter(course =>
        courseIdsforStudent.includes(course.id)
      );

      // a student is considered to be enrolled in a course if they have taken a least one test for that course
      student.courses = [];
      // TODO: change order of courses and totalAverage
      coursesForStudent.forEach(course => {
        course.courseAverage = calcCourseAvg(
          student.id,
          course.id,
          marks,
          tests
        );
        student.courses.push(course);
      });

      student.totalAverage = calcTotalAverage(student);

      // convert student id to a number data type
      student.id = +student.id;
    });

    const data = JSON.stringify({students}, null, 2);
    fs.writeFile(outputFilePath, data, err => {
      if (err) {
        throw err;
      }
      console.log('JSON data is saved.');
    });
  }
);

// node app.js Example1/courses.csv Example1/students.csv Example1/tests.csv Example1/marks.csv output.json

// node app.js Example2/courses.csv Example2/students.csv Example2/tests.csv Example2/marks.csv output.json
