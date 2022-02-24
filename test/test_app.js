const chai = require('chai');
const assert = chai.assert;
const expect = require('chai').expect;
const fs = require('fs');

describe('Report card CLI app', () => {
  it.skip('should return an error message when no arguments are passed to the command line', () => {});

  it.skip('should return an error message when not enough arguments are passed to the command line', () => {});

  it('data should be contained within an object with a “students” key', () => {
    fs.readFile('output.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      expect(JSON.parse(data)).to.have.property('students');
    });
  });
});

// create files for function or for all functions
