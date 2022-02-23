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
  // student data
  const studentsArr = students.map(student => {
    return {id: student.id, name: student.name};
  });

  // testIds
  const testsIdsForStudent = marks
    .filter(mark => mark.student_id === '1')
    .map(mark => mark.test_id);

  // marks for student
  const marksForStudent = marks
    .filter(mark => mark.student_id === '1')
    .map(mark => mark.mark);
  console.log(marksForStudent);

  // courses
  // get tests from certain student
  // get course_ids from arr
  // filter out the duplicate courses_id's
  const courseIdsforStudent = tests
    .filter(test => testsIdsForStudent.includes(test.id))
    .map(test => test.course_id)
    .filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

  const coursesForStudent = courses.filter(course =>
    courseIdsforStudent.includes(course.id)
  );

  coursesForStudent.forEach(course => {
    course.courseAverage;
  });

  // console.log(JSON.stringify({students: studentsArr}));
  console.log(coursesForStudent);

  // course average
  const courseAvgForStudent = (studentId, courseId) => {
    const marksForStudent = marks.filter(
      markObj => markObj.student_id === studentId
    );

    console.log('marksForStudent', marksForStudent);
    const testsForCourse = tests.filter(test => {
      return test.course_id === courseId;
    });

    console.log('testsForCourse', testsForCourse);

    // calc sum- mark / weight
    const sum = testsForCourse.reduce((acc, curr) => {
      const markItem = marksForStudent.find(mark => mark.test_id === curr.id);
      console.log(markItem);
      console.log(markItem.mark, curr.weight / 100);
      console.log(markItem.mark * (curr.weight / 100));
      return acc + markItem.mark * (curr.weight / 100);
    }, 0);

    // console.log('marksForStudent', marksForStudent);
    return sum.toFixed(1);
  };
  console.log('sum', courseAvgForStudent('2', '1'));
  // all marks for student
  // find out which marks belong to which test
  // ^ find out which test belongs to which course and how much it's worth to calculate the mark and worth towards final mark

  console.log(JSON.stringify({students: studentsArr}));
});

// myPromise.then(res => {
//   console.log(res.students[0]);
//   console.log({students: []});
// });

// node app.js Example1/courses.csv Example1/students.csv Example1/tests.csv Example1/marks.csv output.json
