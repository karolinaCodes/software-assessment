const fs = require('fs');
const csv = require('csv-parser');

// create deep clone of array of objects- so don't have unwanted bugs
const deepClone = array => JSON.parse(JSON.stringify(array));

const calcCourseAvg = (courseId, testsAndMarksForStudent) => {
  const testsAndMarksForStudentandCourse = testsAndMarksForStudent.filter(
    item => item.course_id === courseId
  );

  const courseAvg = testsAndMarksForStudentandCourse.reduce(
    (acc, curr) => acc + curr.mark * (curr.weight / 100),
    0
  );

  return +courseAvg.toFixed(2);
};

const calcTotalAverage = courses =>
  +(
    courses.reduce((acc, curr) => acc + curr.courseAverage, 0) / courses.length
  ).toFixed(2);

const checkCourseWeights = tests => {
  const courseIds = tests
    .map(test => test.course_id)
    .filter((value, index, self) => self.indexOf(value) === index);

  let sumValidation = true;
  courseIds.forEach(courseId => {
    const testsForCourse = tests.filter(test => test.course_id === courseId);

    const sum = testsForCourse.reduce((acc, curr) => acc + +curr.weight, 0);

    if (sum !== 100) sumValidation = false;
  });
  return sumValidation;
};

const emptyObject = obj => Object.keys(obj).length === 0;

const parseCSVFile = async (filePath, array) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .on('error', error => {
        reject(error);
      })
      .pipe(csv())
      .on('data', row => {
        // if the object is empty (because the csv parser parsed an empty line), don't add to array
        if (emptyObject(row)) return;
        array.push(row);
      })
      .on('end', () => {
        console.log(`"${filePath}" file parsed.`);
        resolve(`"${filePath}" file parsed.`);
      });
  });
};

const writeJSONFile = (obj, filePath) => {
  const data = JSON.stringify(obj, null, 2);
  fs.writeFile(filePath, data, err => {
    if (err) {
      success = false;
      throw err;
    }
    console.log('JSON data is saved.');
  });
};

const emptyArray = arr => arr.length === 0;

const checkEmptyCSV = (courses, marks, students, tests) => {
  let msg = '';
  if (emptyArray(courses)) {
    msg += 'Courses csv file is empty.';
  }
  if (emptyArray(marks)) {
    msg += 'Marks csv file is empty.';
  }
  if (emptyArray(students)) {
    msg += 'Students csv file is empty.';
  }
  if (emptyArray(tests)) {
    msg += 'Tests csv file is empty.';
  }
  return msg;
};

module.exports = {
  emptyObject,
  deepClone,
  calcCourseAvg,
  calcTotalAverage,
  parseCSVFile,
  writeJSONFile,
  checkCourseWeights,
  checkEmptyCSV,
};
