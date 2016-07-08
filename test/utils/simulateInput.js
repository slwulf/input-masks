'use strict';

const keysim = require('keysim');

module.exports = function(str, input) {
  const keyboard = keysim.Keyboard.US_ENGLISH;

  input.focus();
  keyboard.dispatchEventsForInput(str, input);
  input.blur();

  return input;
}
