const {spawn} = require('child_process');

module.exports = run;

function run(cmd, args, o) {
  return new Promise((res, rej) => {
    let child = spawn(cmd, args, o);
    child.on('exit', res);
    child.on('error', rej);
  });
}
