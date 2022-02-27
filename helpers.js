const fs = require('fs');
const csv = require('csv-parser');

// if the object is empty because the csv parser parsed empty space, don't add to array
const emptyObject = obj => Object.keys(obj).length === 0;

// create deep clone array of objects- so don't have unwanted bugs when use array methods to create new array from array of objects
const deepClone = array => JSON.parse(JSON.stringify(array));

// course average
const calcCourseAvg = (courseId, testsAndMarksForStudent) => {
  const testsAndMarksForStudentandCourse = testsAndMarksForStudent.filter(
    item => item.course_id === courseId
  );

  // TODO: and order totalaverage and
  const courseAvg = testsAndMarksForStudentandCourse.reduce((acc, curr) => {
    return acc + curr.mark * (curr.weight / 100);
  }, 0);

  return +courseAvg.toFixed(2);
};

const calcTotalAverage = student =>
  +(
    student.courses.reduce((acc, curr) => acc + +curr.courseAverage, 0) /
    student.courses.length
  ).toFixed(2);

// TODO: test this function
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
        resolve();
      });
  });
};

const writeJSONFile = (data, filePath) => {
  data = JSON.stringify({students: data}, null, 2);
  fs.writeFile(filePath, data, err => {
    if (err) {
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
};
