# Input Masks

This is a vanilla JavaScript library for creating masked input fields.

### Usage

To apply a mask to a field, you need at minimum an input and a mask string:

```js
inputMask(document.querySelector('input'), { mask: '(###) ### - ####' });
```

Any characters in your mask that are not identifiers (special characters that map to a specfic set of characters) will be taken as literal and passed over when a user types into the field.

The full mask definition API is documented below.

```js
inputMask(document.querySelector('input'), {

  /**
   * mask
   *
   * Defines the format of the mask.
   * Built-in identifiers:
   *   #: [0-9]
   *   a: [A-Za-z]
   */

  mask: '###-##-####',

  /**
   * placeholder
   *
   * A value to be displayed when the
   * field is in focus. Defaults to the
   * mask string.
   */

  placeholder: '___-__-____',

  /**
   * onMatch
   *
   * A function to be run on blur if the
   * input value matches the mask.
   *
   * @param {String} The passing string
   */

  onMatch: function(value) {
    console.log('Value ' + value + ' matches the input mask.');
  },

  /**
   * onFail
   *
   * A function to be run on blur if the
   * input value does not match the mask.
   */

  onFail: function() {
    console.log('No match was found for that value.');
  },

  /**
   * clearOnFail
   *
   * When true, the input field will have its
   * value cleared on blur if the value does
   * not match the mask. Defaults to true.
   */

  clearOnFail: false

});
```

### Defining custom identifiers

By default, input masks can be defined with the characters `#` (for numbers) and `a` (for letters). However, you can define your own identifiers as needed:

```js
inputMask.addIdentifier({ character: '@', match: '[abc123]' });

/**
 * For the character '@' in your mask, the
 * characters a, b, c, 1, 2, and 3 will
 * be allowed. Match strings are case-sensitive.
 */
```

Your match string should be a set or range of characters using the "match a single character" regular expression syntax.

You can also remove identifiers, for example if you need to overwrite the default identifiers:

```js
inputMask.removeIdentifier('#');
```
