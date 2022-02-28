const expect = require('chai').expect;
const fs = require('fs');
const {execSync} = require('child_process');

describe('Report card CLI app', () => {
  let parsedData;

  before(() => {
    execSync(
      'node app.js Example1/courses.csv Example1/students.csv Example1/tests.csv Example1/marks.csv output.json'
    );
    const data = fs.readFileSync('output.json', {encoding: 'utf8'});
    parsedData = JSON.parse(data);
  });

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

  it('should round grades to two digits', () => {
    const rounded = parsedData.students.every(
      student =>
        String(student.totalAverage).split('.').length <= 2 &&
        student.courses.every(
          course => String(course.courseAverage).split('.').length <= 2
        )
    );
    expect(rounded).to.equal(true);
  });

  it('should return a valid JSON object', () => {
    const isJsonObject = obj => {
      try {
        JSON.parse(JSON.stringify(obj));
      } catch (e) {
        return false;
      }
      return true;
    };
    const result = isJsonObject(parsedData);
    expect(result).to.equal(true);
  });

  it('should return an error object with relevant message if the course weights for each course don"t total 100', () => {
    execSync(
      'node app.js Example3/courses.csv Example3/students.csv Example3/tests.csv Example3/marks.csv output.json'
    );
    const data = fs.readFileSync('output.json', {encoding: 'utf8'});
    parsedData = JSON.parse(data);
    expect(parsedData.error).to.equal('Invalid course weights');
  });

  after(() => fs.unlinkSync('output.json'));
});

// create files for function or for all functions
