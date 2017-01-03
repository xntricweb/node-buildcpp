const debug = require('debug')('command-line-parser');
const path = require('path');

const modes = ['build', 'clean'];

function parse(argv) {
  let o = {
    mode: modes[0],
    target: process.cwd()
  };

  for(let i = 0, l = argv.length; i < l; i++) {
    let arg = argv[i];
    if (modes.indexOf(arg.toLowerCase()) != -1) {
      o.mode = arg.toLowerCase();
    } else {
      o.target = arg;
    }
  }

  return o;
}

module.exports = parse;
