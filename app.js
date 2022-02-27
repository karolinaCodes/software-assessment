const {
  deepClone,
  calcCourseAvg,
  calcTotalAverage,
  parseCsvFile,
  writeJSONFile,
} = require('./helpers');

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

Promise.all([
  parseCsvFile(coursesFilePath, courses),
  parseCsvFile(studentsFilePath, students),
  parseCsvFile(testsFilePath, tests),
  parseCsvFile(marksFilePath, marks),
]).then(() => {
  // for each student: create an object with student info and an array of courses and then each course average and finally totalAverage of all courses
  students.forEach(student => {
    // for course average?
    // use in testIdsForStudent
    const marksForStudent = deepClone(marks).filter(
      mark => mark.student_id === student.id
    );

    // all tests a student completed
    const testIdsForStudent = marksForStudent.map(mark => mark.test_id);

    // for course average?
    const testsForStudent = deepClone(tests).filter(test =>
      testIdsForStudent.includes(test.id)
    );

    const testsAndMarksForStudent = testsForStudent.map(test => {
      // find the mark for the test
      const testItem = marksForStudent.find(mark => test.id === mark.test_id);
      test.student_id = testItem.student_id;
      test.mark = testItem.mark;
      return test;
    });

    // get course id's from a student and filter out the duplicate courses_id's
    const courseIdsForStudent = deepClone(tests)
      .filter(test => testIdsForStudent.includes(test.id))
      .map(test => test.course_id)
      .filter((value, index, self) => self.indexOf(value) === index);

    const coursesForStudent = deepClone(courses).filter(course =>
      courseIdsForStudent.includes(course.id)
    );

    student.courses = [];
    // TODO: change order of courses and totalAverage
    coursesForStudent.forEach(course => {
      course.courseAverage = calcCourseAvg(course.id, testsAndMarksForStudent);
      student.courses.push(course);
    });

    student.totalAverage = calcTotalAverage(student);

    // convert student id to a number data type
    student.id = +student.id;
  });
  writeJSONFile(students, outputFilePath);
});

// node app.js Example1/courses.csv Example1/students.csv Example1/tests.csv Example1/marks.csv output.json

// node app.js Example2/courses.csv Example2/students.csv Example2/tests.csv Example2/marks.csv output.json
