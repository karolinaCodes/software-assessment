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

describe('#calcCourseAvg()', () => {
  it('should return student`s course average', () => {
    const testsAndMarksForStudent = [
      {
        id: '1',
        course_id: '1',
        weight: '20',
        student_id: '1',
        mark: '60',
      },
      {
        id: '2',
        course_id: '1',
        weight: '40',
        student_id: '1',
        mark: '60',
      },
      {
        id: '3',
        course_id: '1',
        weight: '40',
        student_id: '1',
        mark: '50',
      },
      {
        id: '4',
        course_id: '2',
        weight: '40',
        student_id: '1',
        mark: '32',
      },
      {
        id: '5',
        course_id: '2',
        weight: '60',
        student_id: '1',
        mark: '65',
      },
      {
        id: '6',
        course_id: '3',
        weight: '90',
        student_id: '1',
        mark: '78',
      },
      {
        id: '7',
        course_id: '3',
        weight: '10',
        student_id: '1',
        mark: '40',
      },
    ];
    const result = calcCourseAvg('1', testsAndMarksForStudent);
    expect(result).to.equal(56);
  });
});

describe('#calcTotalAverage()', () => {
  it('should return a student`s total average', () => {
    const completeStudentCourses = [
      {id: '1', name: 'Biology', teacher: 'Mr. D', courseAverage: 50.1},
      {id: '2', name: 'History', teacher: ' Mrs. P', courseAverage: 51.8},
      {id: '3', name: 'Math', teacher: ' Mrs. C', courseAverage: 80.2},
    ];
    const result = calcTotalAverage(completeStudentCourses);
    expect(result).to.equal(60.7);
  });
});
