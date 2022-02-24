// if the object is empty because the csv parser parsed empty space, don't add to array
const emptyObject = obj => Object.keys(obj).length === 0;

// create deep clone array of objects- so don't have unwanted bugs when use array methods to create new array from array of objects
const deepClone = array => JSON.parse(JSON.stringify(array));

// course average
const courseAvgForStudent = (studentId, courseId, marks, tests) => {
  const marksForStudent = deepClone(marks).filter(
    markObj => markObj.student_id === studentId
  );

  // all tests for the specific course that passed into ftn
  const testsForCourse = deepClone(tests).filter(
    test => test.course_id === courseId
  );

  const studentsMarksForCourse = marksForStudent.filter(mark =>
    testsForCourse.find(test => test.id === mark.test_id)
  );

  const courseAvg = studentsMarksForCourse.reduce((acc, curr) => {
    // find the test that goes with the students mark
    const testItem = testsForCourse.find(test => test.id === curr.test_id);
    return acc + curr.mark * (testItem.weight / 100);
  }, 0);
  return +courseAvg.toFixed(1);
};

module.exports = {emptyObject, deepClone, courseAvgForStudent};
