const fs = require('fs');
const csv = require('csv-parser');

// if the object is empty because the csv parser parsed empty space, don't add to array
const emptyObject = obj => Object.keys(obj).length === 0;

// create deep clone array of objects- so don't have unwanted bugs when use array methods to create new array from array of objects
const deepClone = array => JSON.parse(JSON.stringify(array));

const calcCourseAvg = (courseId, testsAndMarksForStudent) => {
  const testsAndMarksForStudentandCourse = testsAndMarksForStudent.filter(
    item => item.course_id === courseId
  );

  const res = testsAndMarksForStudentandCourse.reduce((acc, curr) => {
    return acc + +curr.weight;
  }, 0);

  const courseAvg = testsAndMarksForStudentandCourse.reduce((acc, curr) => {
    return acc + curr.mark * (curr.weight / 100);
  }, 0);

  return +courseAvg.toFixed(2);
};

const calcTotalAverage = courses =>
  +(
    courses.reduce((acc, curr) => acc + curr.courseAverage, 0) / courses.length
  ).toFixed(2);

const checkSumOfCourseWeights = tests => {
  const courseIds = tests
    .map(test => {
      return test.course_id;
    })
    .filter((value, index, self) => self.indexOf(value) === index);

  let sumValidation = true;
  courseIds.forEach(courseId => {
    const res = tests.filter(test => {
      return test.course_id === courseId;
    });

    const total = res.reduce((acc, curr) => {
      return acc + +curr.weight;
    }, 0);

    if (total !== 100) {
      sumValidation = false;
    }
  });
  return sumValidation;
};

const parseCsvFile = async (filePath, array) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .on('error', error => {
        reject(error);
      })
      .pipe(csv())
      .on('data', row => {
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

module.exports = {
  emptyObject,
  deepClone,
  calcCourseAvg,
  calcTotalAverage,
  parseCsvFile,
  writeJSONFile,
  checkSumOfCourseWeights,
};
