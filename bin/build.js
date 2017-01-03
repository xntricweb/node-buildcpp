const os = require('os');
const cl = require('../src/command-line-parser.js');

const builder = (function() {
  switch (os.type()) {
    case 'Windows_NT': return require('./windows-build-helper.js')();
  }
})();

let {mode, target} = cl(process.argv.slice(2));

if (!builder[mode]) {
  console.log(`${mode} is currently unsupported on the current platform.`);
}

builder[mode](target)
.then(function(){
  console.log('Build OK');
}, function(err) {
  console.error('Build Failed');
})
