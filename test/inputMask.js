'use strict';

const test = require('tape');

module.exports = function(window) {
  const inputMask = window.inputMask;
  const document = window.document;

  test('inputMask accepts an arguments object',
  assert => {
    const input = document.createElement('input');
    inputMask(input, { mask: '##-##' })
    input.focus();

    const actual = input.value;
    const expected = '##-##';

    assert.equal(actual, expected);
    assert.end();
  });

  test('inputMask accepts a mask string as its second argument',
  assert => {
    const input = document.createElement('input');
    inputMask(input, '##-##');
    input.focus();

    const actual = input.value;
    const expected = '##-##';

    assert.equal(actual, expected);
    assert.end();
  });

  test('inputMask throws an error when called without a mask definition',
  assert => {
    const input = document.createElement('input');
    const fn = () => inputMask(input, { placeholder: '__-__' });

    assert.throws(fn);
    assert.end();
  });
}
