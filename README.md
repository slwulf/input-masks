# Input Masks

This is a vanilla JavaScript library for creating masked input fields.

### Usage

To apply a mask to a field, you need at minimum an input and a mask string:

```js
inputMask(document.querySelector('input'), { mask: '(###) ### - ####' });
```

The full API is documented below.

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
