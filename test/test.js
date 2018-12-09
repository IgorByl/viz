/* eslint-disable no-undef */
import recountTooltipNumber from '../src/index';

const assert = require('assert');

describe('RecountTooltipNumber', () => {
  it('return number of clips on the page', () => {
    assert.equal(recountTooltipNumber(), '123');
  });
});

// describe('Basic Mocha String Test', () => {
//   it('should return number of charachters in a string', () => {
//     assert.equal('Hello'.length, 5);
//   });
//   it('should return first charachter of the string', () => {
//     assert.equal('Hello'.charAt(0), 'H');
//   });
// });
