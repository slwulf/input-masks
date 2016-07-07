'use strict';

const test = require('tape');
const keysim = require('keysim');

// placeholder value for lifecycle hook fns
let lastAction = null;

const libSettings = Object.freeze({
  mask: '##-aa', // number, number, -, letter, letter
  placeholder: '__-__',
  onMatch: function(value) {
    lastAction = { name: 'onMatch', message: value };
  },
  onFail: function() {
    lastAction = { name: 'onFail', message: 'No match.' };
  }
});

require('jsdom').env(
  '<html><body></body></html>', ['./dist/input-masks.js'], runTests);

function runTests(err, window) {
  const inputMask = window.inputMask;
  const document = window.document;

  test('inputMask', t => {
    t.plan(3);

    const input = document.createElement('input');

    t.doesNotThrow(() => inputMask(input, libSettings),
      'inputMask accepts an arguments object');

    t.doesNotThrow(() => inputMask(input, '##-##'),
      'inputMask accepts a mask string as its second argument');

    t.throws(() => inputMask(input, {
      placeholder: '__-__'
    }), 'inputMask throws an error when called without a mask definition');
  });

  test('placeholder behavior', t => {
    t.plan(2);

    const input = document.createElement('input');
    inputMask(input, '##-##');
    input.focus();

    t.equal(input.value, '##-##',
      'placeholder defaults to mask value');

    const input2 = document.createElement('input');
    inputMask(input2, {
      mask: '##-##',
      placeholder: '__-__'
    });
    input2.focus();

    t.equal(input2.value, '__-__',
      'placeholder value can be set');
  });

  test('lifecycle hooks', t => {
    t.plan(4);

    let onMatch = false;
    const onMatchInput = document.createElement('input');
    inputMask(onMatchInput, {
      mask: '###',
      onMatch: (val) => onMatch = val
    });

    simulateInput('123', onMatchInput);

    t.ok(onMatch, 'onMatch event is fired');
    t.equal(onMatch, '123',
      'onMatch passes matched value as an argument');

    let onFail = false;
    const onFailInput = document.createElement('input');
    inputMask(onFailInput, {
      mask: '###',
      onFail: () => onFail = true
    });

    simulateInput('1', onFailInput);

    t.ok(onFail, 'onFail event is fired');

    const clearOnFail = document.createElement('input');
    inputMask(clearOnFail, {
      mask: '###',
      clearOnFail: false
    });

    simulateInput('1', clearOnFail);

    t.equal(clearOnFail.value, '1##',
      'clearing field on non-matching input can be disabled');
  });

  test('custom identifiers', t => {
    t.plan(3);

    t.fail('new identifiers can be added');
    t.fail('identifiers can be removed');
    t.fail('cannot create identifiers with the same character');
  });

  test('input navigation', t => {
    t.plan(4);

    t.fail('backspace');
    t.fail('tab');
    t.fail('arrow keys');
    t.fail('enter');
  });
}

function simulateInput(str, input) {
  const keyboard = keysim.Keyboard.US_ENGLISH;

  input.focus();
  keyboard.dispatchEventsForInput(str, input);
  input.blur();

  return input;
}
