const expect = require('chai').expect;
const {
  emptyObject,
  deepClone,
  calcCourseAvg,
  calcTotalAverage,
  checkCourseWeights,
  parseCSVFile,
  writeJSONFile,
  checkEmptyCSVFile,
  emptyArray,
} = require('./../helpers');

describe('#emptyObject()', () => {
  it('should true if object has no properties', () => {
    const result = emptyObject({});
    expect(result).to.equal(true);
  });
  it('should false if object has properties', () => {
    const result = emptyObject({a: '1'});
    expect(result).to.equal(false);
  });
});

describe('#deepClone()', () => {
  it('should return deep clone array of objects', () => {
    const obj = {a: [1, 2], b: [3, 4]};
    const result = deepClone(obj);
    let clone = true;
    for (const key in obj) {
      for (let i = 0; i < obj[key].length; i++) {
        if (obj[key][i] !== result[key][i]) {
          clone = false;
        }
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

describe('#checkCourseWeights()', () => {
  it('should return true if the course weights for each courses add up to 100', () => {
    const tests = [
      {id: '1', course_id: '1', weight: '10'},
      {id: '2', course_id: '1', weight: '40'},
      {id: '3', course_id: '1', weight: '50'},
      {id: '4', course_id: '2', weight: '40'},
      {id: '5', course_id: '2', weight: '60'},
      {id: '6', course_id: '3', weight: '90'},
      {id: '7', course_id: '3', weight: '10'},
    ];
    const result = checkCourseWeights(tests);
    expect(result).to.equal(true);
  });

  it('should return false if the course weights for each courses don"t add up to 100', () => {
    const tests = [
      {id: '1', course_id: '1', weight: '10'},
      {id: '2', course_id: '1', weight: '10'},
      {id: '3', course_id: '1', weight: '50'},
      {id: '4', course_id: '2', weight: '40'},
      {id: '5', course_id: '2', weight: '60'},
      {id: '6', course_id: '3', weight: '90'},
      {id: '7', course_id: '3', weight: '10'},
    ];
    const result = checkCourseWeights(tests);
    expect(result).to.equal(false);
  });
});

describe('#parseCSVFile()', () => {
  it('should successfully parse a csv file', async () => {
    const coursesFilePath = 'Example1/courses.csv';
    const courses = [];
    const result = await parseCSVFile(coursesFilePath, courses);
    expect(result).to.equal(`"${coursesFilePath}" file parsed.`);
  });
});

describe('#writeJSONFile()', () => {
  it('should successfully write a JSON file', async () => {
    const obj = {
      students: [
        {
          id: 5,
          name: 'D',
          totalAverage: 26.55,
          courses: [
            {
              id: 1,
              name: 'Biology',
              teacher: 'Mr. D',
              courseAverage: 1.3,
            },
            {
              id: 2,
              name: 'History',
              teacher: ' Mrs. P',
              courseAverage: 51.8,
            },
          ],
        },
      ],
    };
    const filePath = 'output.json';
    const result = writeJSONFile(obj, filePath);
    expect(!result).to.equal(true);
  });
});

describe('#emptyArray()', () => {
  it('should true if array is empty', () => {
    const result = emptyArray([]);
    expect(result).to.equal(true);
  });

  it('should false if array is empty', () => {
    const result = emptyArray([1, 2, 3]);
    expect(result).to.equal(false);
  });
});

describe('#checkEmptyCSVFile()', () => {
  it('should return an error message if CSV file is empty', () => {
    const courses = [];
    const marks = [
      {test_id: '4', student_id: '5', mark: '32'},
      {test_id: '5', student_id: '5', mark: '65'},
      {test_id: '1', student_id: '5', mark: '13'},
    ];
    const students = [{id: '5', name: 'D'}];
    const tests = [
      {id: '1', course_id: '1', weight: '10'},
      {id: '2', course_id: '1', weight: '40'},
      {id: '3', course_id: '1', weight: '50'},
      {id: '4', course_id: '2', weight: '40'},
      {id: '5', course_id: '2', weight: '60'},
    ];
    const result = checkEmptyCSVFile(courses, marks, students, tests);
    expect(result).to.equal('Courses csv file is empty.');
  });
  it('should return an empty string if CSV file is not empty', () => {
    const courses = [
      {id: '1', name: 'Biology', teacher: 'Mr. D'},
      {id: '2', name: 'History', teacher: ' Mrs. P'},
    ];
    const marks = [
      {test_id: '4', student_id: '5', mark: '32'},
      {test_id: '5', student_id: '5', mark: '65'},
      {test_id: '1', student_id: '5', mark: '13'},
    ];
    const students = [{id: '5', name: 'D'}];
    const tests = [
      {id: '1', course_id: '1', weight: '10'},
      {id: '2', course_id: '1', weight: '40'},
      {id: '3', course_id: '1', weight: '50'},
      {id: '4', course_id: '2', weight: '40'},
      {id: '5', course_id: '2', weight: '60'},
    ];
    const result = checkEmptyCSVFile(courses, marks, students, tests);
    expect(result).to.equal('');
  });
});
