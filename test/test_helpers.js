const expect = require('chai').expect;
const {
  emptyObject,
  deepClone,
  calcCourseAvg,
  calcTotalAverage,
} = require('./../helpers');

describe('emptyObject()', () => {
  it('should true if object has no properties', () => {
    const result = emptyObject({});
    expect(result).to.equal(true);
  });
  it('should false if object has properties', () => {
    const result = emptyObject({a: '1'});
    expect(result).to.equal(false);
  });
});

describe('deepClone()', () => {
  it.skip('should return deep clone array of objects', () => {
    const obj = {a: [1, 2], b: [3, 4]};
    const result = deepClone(obj);
    let clone = true;
    for (const key in obj) {
      if (obj[key] !== result[key]) {
        clone = false;
      }
    }
    const isClone = clone && obj !== result;
    expect(isClone).to.equal(true);
  });
});

describe('courseAvgForStudent()', () => {
  it('should return student`s course average', () => {
    const marks = [
      {test_id: '1', student_id: '1', mark: '60'},
      {test_id: '2', student_id: '1', mark: '60'},
      {test_id: '3', student_id: '1', mark: '50'},
      {test_id: '4', student_id: '1', mark: '32'},
      {test_id: '5', student_id: '1', mark: '65'},
      {test_id: '6', student_id: '1', mark: '78'},
      {test_id: '7', student_id: '1', mark: '40'},
      {test_id: '1', student_id: '2', mark: '78'},
      {test_id: '2', student_id: '2', mark: '87'},
      {test_id: '3', student_id: '2', mark: '15'},
      {test_id: '6', student_id: '2', mark: '78'},
      {test_id: '7', student_id: '2', mark: '40'},
      {test_id: '1', student_id: '3', mark: '78'},
      {test_id: '2', student_id: '3', mark: '87'},
      {test_id: '3', student_id: '3', mark: '95'},
      {test_id: '4', student_id: '3', mark: '32'},
      {test_id: '5', student_id: '3', mark: '65'},
      {test_id: '6', student_id: '3', mark: '78'},
      {test_id: '7', student_id: '3', mark: '40'},
    ];
    const tests = [
      {id: '1', course_id: '1', weight: '20'},
      {id: '2', course_id: '1', weight: '40'},
      {id: '3', course_id: '1', weight: '40'},
      {id: '4', course_id: '2', weight: '40'},
      {id: '5', course_id: '2', weight: '60'},
      {id: '6', course_id: '3', weight: '90'},
      {id: '7', course_id: '3', weight: '10'},
    ];
    const result = calcCourseAvg('1', '1', marks, tests);
    expect(result).to.equal(56);
  });
});

describe('calcTotalAverage()', () => {
  it('should return a student`s total average', () => {
    const student = {
      id: 3,
      name: 'Z',
      courses: [
        {id: '1', name: 'Math', teacher: 'Mr. D', courseAverage: 50.1},
        {
          id: '2',
          name: 'Geography',
          teacher: ' Mrs. P',
          courseAverage: 51.8,
        },
        {id: '3', name: 'History', teacher: ' Mrs. C', courseAverage: 80.2},
      ],
    };
    const result = calcTotalAverage(student);
    expect(result).to.equal(60.7);
  });
});
