'use strict';

const test = require('tape');
const simulateInput = require(__dirname + '/utils/simulateInput.js');

module.exports = function(window) {
  const inputMask = window.inputMask;
  const document = window.document;

  test('onMatch passes matched value as an argument',
  assert => {
    const input = document.createElement('input');
    let enteredValue = null;

    inputMask(input, {
      mask: '###',
      onMatch: (val) => enteredValue = val
    });

    simulateInput('123', input);

    const actual = enteredValue;
    const expected = '123';

    assert.equal(actual, expected);
    assert.end();
  });

  test('onFail event fires when input is incomplete',
  assert => {
    const input = document.createElement('input');
    let inputFailed = false;

    inputMask(input, {
      mask: '###',
      onFail: () => inputFailed = true
    });

    simulateInput('12', input);

    const actual = inputFailed;
    const expected = true;

    assert.equal(actual, expected);
    assert.end();
  });

  test('clearing field on non-matching input can be disabled',
  assert => {
    const input = document.createElement('input');

    inputMask(input, {
      mask: '###',
      clearOnFail: false
    });

    simulateInput('12', input);

    const actual = input.value;
    const expected = '12#';

    assert.equal(actual, expected);
    assert.end();
  });
}
