const chai = require('chai');
const assert = chai.assert;
const expect = require('chai').expect;
const fs = require('fs');

describe('Report card CLI app', () => {
  let parsedData;

  beforeEach(() => {
    const data = fs.readFileSync('output.json', {encoding: 'utf8'});
    parsedData = JSON.parse(data);
  });

  it.skip('should return an error message when no arguments are passed to the command line', () => {});

  it.skip('should return an error message when not enough arguments are passed to the command line', () => {});

  it('data should be contained within an object with a “students” key', () => {
    expect(parsedData).to.have.property('students');
  });

  it('students array should be ordered by id', () => {
    const studentIds = parsedData.students.map(student => student.id);
    const sortedstudentIds = [...studentIds].sort((a, b) => a - b);
    expect(studentIds).to.deep.equal(sortedstudentIds);
  });

  it('data type for students ids is "number"', () => {
    const areNumbers = parsedData.students.every(
      student => typeof student.id === 'number'
    );
    expect(areNumbers).to.equal(true);
  });

  it('data type for grades is "number"', () => {
    const areNumbers = parsedData.students.every(
      student =>
        typeof student.totalAverage === 'number' &&
        student.courses.every(
          course => typeof course.courseAverage === 'number'
        )
    );
    expect(areNumbers).to.equal(true);
  });

  it('grades are rounded to two digits', () => {
    const rounded = parsedData.students.every(
      student =>
        String(student.totalAverage).split('.').length <= 2 &&
        student.courses.every(
          course => String(course.courseAverage).split('.').length <= 2
        )
    );
    expect(rounded).to.equal(true);
  });
});

// create files for function or for all functions
