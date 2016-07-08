'use strict';

require('jsdom').env(
  '<html><body></body></html>',
  ['./dist/input-masks.js'],
  runTests);

function runTests(err, window) {
  const fs = require('fs');
  fs.readdir(__dirname, (err, files) => {
    files
      .filter(f => !(/^index\./).test(f))
      .filter(f => (/\.js$/).test(f))
      .forEach(filename => {
        require('./' + filename)(window);
      });
  });
}
