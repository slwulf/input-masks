'use strict';

const test = require('tape');

module.exports = function(window) {
  const inputMask = window.inputMask;
  const document = window.document;

  test('placeholder defaults to mask value',
  assert => {
    const input = document.createElement('input');
    inputMask(input, { mask: '##-##' })
    input.focus();

    const actual = input.value;
    const expected = '##-##';

    assert.equal(actual, expected);
    assert.end();
  });

  test('placeholder value can be set',
  assert => {
    const input = document.createElement('input');
    inputMask(input, { mask: '##-##', placeholder: '__-__' });
    input.focus();

    const actual = input.value;
    const expected = '__-__';

    assert.equal(actual, expected);
    assert.end();
  });

  // TODO:
  test('placeholder must match structure of mask',
  { skip: true },
  assert => {
    const input = document.createElement('input');
    const fn = () => inputMask(input, { mask: '##_##', placeholder: '__-__' });
    const len = () => inputMask(input, { mask: '##-#', placeholder: '_-_' });

    assert.throws(fn);
    assert.throws(len);
    assert.end();
  });
}
