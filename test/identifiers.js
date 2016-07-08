'use strict';

const test = require('tape');
const simulateInput = require(__dirname + '/utils/simulateInput.js');

module.exports = function(window) {
  const inputMask = window.inputMask;
  const document = window.document;

  test('new identifiers can be created',
  assert => {
    inputMask.addIdentifier({
      character: '@',
      match: '[abc]'
    });

    const input = document.createElement('input');
    inputMask(input, { mask: '@@@', clearOnFail: false });

    simulateInput('cde', input);

    const actual = input.value;
    const expected = 'c@@';

    assert.equal(actual, expected);
    assert.end();
  });

  test('existing identifiers can be removed',
  assert => {
    inputMask.removeIdentifier('@');

    const input = document.createElement('input');
    inputMask(input, { mask: '@@@', clearOnFail: false });

    simulateInput('cde', input);

    const actual = input.value;
    const expected = '@@@';

    assert.equal(actual, expected);
    assert.end();
  });

  test('identifiers cannot be created if the character is already an identifier',
  assert => {
    const fn = () => inputMask.addIdentifier('#');

    assert.throws(fn);
    assert.end();
  });
}
