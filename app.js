const {
  deepClone,
  calcCourseAvg,
  calcTotalAverage,
  parseCsvFile,
  writeJSONFile,
  checkSumOfCourseWeights,
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
  // check if the sum of all weights of every test in a particular course should add up to 100
  if (!checkSumOfCourseWeights(tests)) {
    return writeJSONFile({error: 'Invalid course weights'}, outputFilePath);
  }

  // for each student object: add students' info, totalAverage of all courses, and array of courses incld. each course average.
  students.forEach(student => {
    const marksForStudent = deepClone(marks).filter(
      mark => mark.student_id === student.id
    );

    // all tests ids of test a student completed
    const testIdsForStudent = marksForStudent.map(mark => mark.test_id);

    // all tests a student completed
    const testsForStudent = deepClone(tests).filter(test =>
      testIdsForStudent.includes(test.id)
    );

    // merge marksForStudent and testsForStudent so test object includes mark
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

    // add courseAverage to courses
    const completeStudentCourses = coursesForStudent.map(course => {
      course.courseAverage = calcCourseAvg(course.id, testsAndMarksForStudent);
      // console.log('one', testsAndMarksForStudent);
      return course;
    });
    const totalAverage = calcTotalAverage(completeStudentCourses);
    console.log(completeStudentCourses);

    student.totalAverage = totalAverage;
    student.courses = completeStudentCourses;

    // convert student id to number data type
    student.id = +student.id;

    // convert course id to number data type
    student.courses.forEach(course => (course.id = +course.id));
  });

  // sort students by id
  students.sort((a, b) => a.id - b.id);

  writeJSONFile({students}, outputFilePath);
});

// node app.js Example1/courses.csv Example1/students.csv Example1/tests.csv Example1/marks.csv output.json

// node app.js Example2/courses.csv Example2/students.csv Example2/tests.csv Example2/marks.csv output.json

// TODO: test new functions, clean up code, hand in.
