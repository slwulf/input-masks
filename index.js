/**
 * Input Masks
 */

(function() {

  /**
   * identifiers
   *
   * Each identifier should have a single-length
   * character and a match string like regex. The
   * match string determines what characters are
   * acceptable for instances of the character
   * in a given input mask.
   */

  let identifiers = [
    { character: '#', match: '[0-9]' },
    { character: 'a', match: '[A-Za-z]' }
  ];

  /**
   * getMatchForChar
   *
   * Returns an identifier match string for
   * a given character, or null if no matching
   * identifier was found.
   *
   * @param {String} char Character to look up
   * @return {String|Null} Match string for char
   */

  function getMatchForChar(char) {
    return identifiers.reduce((out, iden) => {
      return iden.character === char ? iden.match : out;
    }, null);
  }

  /**
   * matchChar
   *
   * Given an identifier match string,
   * determines whether a given character
   * is acceptable.
   *
   * @param {String} match Match string for testing
   * @param {String} char Character to test
   * @return {Boolean} True if char passes match test
   */

  function matchChar(match, char) {
    let regex = new RegExp(match);
    return regex.test(char);
  }

  /**
   * matchInput
   *
   * Tests an input string against an input mask.
   *
   * @param {String} str Input string to test
   * @param {String} mask Input mask to test against
   * @return {Boolean} True if the str matches mask
   */

  function matchInput(str, mask) {
    if (str.length !== mask.length) return false;

    // look at chars one by one
    let strChars = str.split('');
    return strChars.every((char, i) => {
      let maskCharAtPos = mask[i];
      let matchStr = getMatchForChar(maskCharAtPos);
      return matchStr === null && maskCharAtPos === char || matchChar(matchStr, char);
    });
  }

  /**
   * strToMask
   *
   * Converts a plain string to its masked
   * version given a mask to parse.
   *
   * @param {String} str String to convert
   * @param {String} mask Mask to parse
   * @return {String} Masked string, or null if no match
   */

  function strToMask(str, mask) {
    let string = str.split('');
    let output = mask.split('').reduce((out, maskChar, i) => {
      let strChar = string.shift();
      let match = getMatchForChar(maskChar);
      let allowedChar = matchChar(match, strChar);

      if (match && allowedChar) return replaceCharAtPos(out, i, strChar);

      string.unshift(strChar);
      return out;
    }, mask);

    return matchInput(output, mask) ? output : null;
  }

  /**
   * findNextIdentifier
   *
   * Gets the index of the next identifier
   * character in a given string starting
   * from a given index, or from 0 by default.
   * Returns -1 if no identifier was found.
   *
   * @param {String} str A string to search
   * @param {Number} index Index to start from
   * @return {Number} Index of the character in the string
   */

  function findNextIdentifier(str, index = 0) {
    let string = index > 0 ? str.substr(index) : str;
    let chars = identifiers.map(x => x.character);
    return string.split('').reduce((int, char, i) => {
      let isIdentifier = chars.indexOf(char) > -1;
      let result = index > 0 ? i + index : i;
      if (int > -1) return int;
      return isIdentifier ? result : int;
    }, -1);
  }

  /**
   * replaceCharAtPos
   *
   * Replaces the character at a given index
   * in a string with a new given character.
   *
   * @param {String} str Input string
   * @param {Number} pos Index to replace at
   * @param {String} char Character(s) to replace with
   * @return {String} Output string
   */

  function replaceCharAtPos(str, pos, char) {
    if (!char) return str;
    return str.substr(0, pos) + char + str.substr(pos + 1);
  }

  /**
   * setCursorPosition
   *
   * Sets the cursor position in a focused
   * input (el) to a given index, or 0.
   *
   * @param {Element} el Focused input element
   * @param {Number} index Position to set, 0 by default
   */

  function setCursorPosition(el, index = 0) {
    el.setSelectionRange(index, index);
  }

  /**
   * focusHandler
   *
   * On focus, display the placeholder
   * and set the cursor position to
   * the first identifier character.
   */

  function focusHandler(event) {
    let mask = this.mask;
    let placeholder = this.placeholder;
    let index = findNextIdentifier(mask);

    if (event.target.value === '') {
      event.target.value = this.placeholder;
      setCursorPosition(event.target, index);
    } else if (matchInput(event.target.value, mask)) {
      setCursorPosition(event.target, placeholder.length);
    } else {
      index = event.target.value.split('')
        .reduce((num, char, i) => {
          let matchStr = getMatchForChar(mask[i]);

          if (matchChar(matchStr, char)) return i + 1;
          if (placeholder[i] === char) return num;

          return num;
        }, index);

      setCursorPosition(event.target, findNextIdentifier(mask, index));
    }
  }

  /**
   * keypressHandler
   *
   * On keypress, parse the input and
   * match it against the input mask.
   */

  function keypressHandler(event) {
    let value = event.target.value;
    let cursorPos = event.target.selectionStart;
    let keyCode = event.keyCode;
    let character = String.fromCharCode(event.charCode);

    // get chars at cursor position
    let maskCharAtPos = this.mask[cursorPos];
    let maskCharNext = this.mask[cursorPos + 1];
    let valCharAtPos = value[cursorPos];
    let valCharNext = value[cursorPos + 1];

    // check if event key is allowed by mask char
    let charAllowed = identifiers.reduce((bool, iden) => {
      return iden.character === maskCharAtPos ? matchChar(iden.match, character) : bool;
    }, false);

    // index of next idenfitier char
    let nextPos = findNextIdentifier(this.mask, cursorPos);
    if (nextPos === cursorPos || getMatchForChar(maskCharNext) === null) {
      nextPos = findNextIdentifier(this.mask, cursorPos + 1);
    }

    // prevent default for all keys except tab, enter and arrows
    if ([9, 13, 37, 38, 39, 40].indexOf(keyCode) === -1) {
      event.preventDefault();
    }

    // handle other allowed keypresses
    if (!charAllowed && character !== valCharAtPos) {
      // backspace
      if (keyCode === 8) {
        event.target.value = replaceCharAtPos(value, cursorPos - 1, this.placeholder[cursorPos - 1]);
        setCursorPosition(event.target, cursorPos - 1);
      // space
      } else if (keyCode === 32) {
        if (maskCharNext && maskCharNext === valCharNext) {
          setCursorPosition(event.target, nextPos);
        }
      }

      // then, exit the callback
      return;
    }

    // update input value with event char at cursor position
    event.target.value = replaceCharAtPos(value, cursorPos, character);

    // move cursor to the next identifier
    if (nextPos > -1) setCursorPosition(event.target, nextPos);
  }

  /**
   * blurHandler
   *
   * On blur, clear the field value if
   * the original placeholder remains or
   * if the input does not pass the regex
   * test and the clearOnFail setting is false.
   */

  function blurHandler(event) {
    let match = matchInput(event.target.value, this.mask);

    if (match && this.onMatch) this.onMatch(event.target.value);
    if (!match && this.onFail) this.onFail();
    if (!match && this.clearOnFail !== false) event.target.value = '';
  }

  /**
   * inputMask
   *
   * Assign an input mask to a given field
   * (el) with a mask and a placeholder.
   *
   * @param {Element} el Field to mask
   * @param {Object} settings Settings for the mask
   *   @key {String} mask Mask string for matching
   *   @key {String} placeholder String to display in field
   *   @key {Function} onMatch Runs on blur if input matches mask
   *   @key {Function} onFail Runs on blur if input doesn't match mask
   *   @key {Boolean} clearOnFail When true, clear value on blur if
   *                              input doesn't match mask (defaults true)
   */

  function inputMask(el, settings) {
    if (!settings.placeholder) settings.placeholder = settings.mask;
    if (!settings.mask || typeof settings.mask !== 'string') {
      throw new Error('inputMask called with invalid mask string: ' + settings.mask);
    }

    let parsedValue = strToMask(el.value, settings.mask);
    if (parsedValue) {
      el.value = parsedValue;
      if (settings.onMatch) settings.onMatch(parsedValue);
    }

    el.addEventListener('focus', focusHandler.bind(settings));
    el.addEventListener('keypress', keypressHandler.bind(settings));
    el.addEventListener('blur', blurHandler.bind(settings));
  }

  /**
   * inputMask.addIdentifier
   *
   * Adds a new identifier object to
   * the list, allowing implementers
   * to define custom masks.
   *
   * @param {Object} identifier New identifier to add
   *   @key {String} character Character to use in masks
   *   @key {String} match Regex for allowed characters
   */

  inputMask.addIdentifier = function(identifier) {
    if (!identifier || !identifier.character || !identifier.match) {
      throw new Error('New identifier must contain a character and a match.');
    }

    if (identifier.character.length > 1) {
      throw new Error('Identifier character must have length of 1.');
    }

    if (getMatchForChar(identifier.character) !== null) {
      throw new Error('Identifier already exists for character ' + identifier.character);
    }

    identifiers.push({ character: identifier.character, match: identifier.match });
  };

  /**
   * inputMask.removeIdentifier
   *
   * Removes an identifier from the list,
   * allowing implementers to overwrite
   * defaults and remove custom identifiers.
   *
   * @param {String} character Character property of the identifier to remove
   */

  inputMask.removeIdentifier = function(character) {
    let identifier =
      identifiers.filter((iden) => iden.character === character)[0];

    let index = identifiers.indexOf(identifier);
    if (identifier && index > -1) return identifiers.splice(index, 1);
    throw new Error('Could not find identifier for character ' + character);
  };

  // export the function
  window.inputMask = inputMask;

})();
