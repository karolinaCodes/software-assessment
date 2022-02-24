const fs = require('fs');
const csv = require('csv-parser');
const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const argv = yargs(hideBin(process.argv))
  .help()
  .usage(
    'You need to pass these following arguments: \n {path-to-courses-file} {path-to-students-file} {path-to-tests-file} {path-to-marks-file} {path-to-output-file}\n Example: “node app.js courses.csv students.csv tests.csv marks.csv output.json”'
  )
  .demandCommand(1).argv;

const [coursesFile, studentsFile, testsFile, marksFile, outputFile] = argv._;
const courses = [];
const marks = [];
const students = [];
const tests = [];

new Promise((resolve, reject) => {
  // if error, reject
  fs.createReadStream(coursesFile)
    .pipe(csv())
    .on('data', row => courses.push(row))
    .on('end', () => {
      console.log(`"${coursesFile}" file parsed.`);

      fs.createReadStream(studentsFile)
        .pipe(csv())
        .on('data', row => students.push(row))
        .on('end', () => {
          console.log(`"${studentsFile}" file parsed.`);

          fs.createReadStream(testsFile)
            .pipe(csv())
            .on('data', row => tests.push(row))
            .on('end', () => {
              console.log(`"${testsFile}" file parsed.`);

              fs.createReadStream(marksFile)
                .pipe(csv())
                .on('data', row => marks.push(row))
                .on('end', () => {
                  console.log(`"${marksFile}" file parsed.`);
                  resolve();
                });
            });
        });
    });
}).then(() => {
  // create deep clone array of objects- so don't have unwanted bugs when use array methods to create new array from array of objects
  const deepClone = array => JSON.parse(JSON.stringify(array));

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
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

    const coursesForStudent = deepClone(courses).filter(course =>
      courseIdsforStudent.includes(course.id)
    );

    // course average
    const courseAvgForStudent = (studentId, courseId) => {
      const marksForStudent = deepClone(marks).filter(
        markObj => markObj.student_id === studentId
      );

      // all tests for the specific course that passed into ftn
      const testsForCourse = deepClone(tests).filter(test => {
        return test.course_id === courseId;
      });

      const studentsMarksForCourse = marksForStudent.filter(mark => {
        return testsForCourse.find(test => test.id === mark.test_id);
      });

      const courseAvg = studentsMarksForCourse.reduce((acc, curr) => {
        // find the test that goes with the students mark
        const testItem = testsForCourse.find(test => {
          return test.id === curr.test_id;
        });
        return acc + curr.mark * (testItem.weight / 100);
      }, 0);

      return courseAvg.toFixed(1);
    };

    // a student is considered to be enrolled in a course if they have taken a least one test for that course
    student.courses = [];
    // TODO: change order of courses and totalAverage
    coursesForStudent.forEach(course => {
      course.courseAverage = courseAvgForStudent(student.id, course.id);
      student.courses.push(course);
    });

    // add total average for each student
    student.totalAverage = (
      student.courses.reduce((acc, curr) => {
        return acc + +curr.courseAverage;
      }, 0) / student.courses.length
    ).toFixed(2);
  });

  const data = JSON.stringify({students}, null, 2);
  fs.writeFile(outputFile, data, err => {
    if (err) {
      throw err;
    }
    console.log('JSON data is saved.');
  });
});

// node app.js Example1/courses.csv Example1/students.csv Example1/tests.csv Example1/marks.csv output.json

// node app.js Example2/courses.csv Example2/students.csv Example2/tests.csv Example2/marks.csv output.json
