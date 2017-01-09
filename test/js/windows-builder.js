const WindowsBuilder = require('../../src/builder-Windows_NT.js');
const {expect} = require('chai').use(require('chai-fs'));

describe('windows-builder', function() {
  describe('build', function() {
    it('should build a simple c application', function() {
      let builder = new WindowsBuilder();
      return builder.loadProject('test/simple-app')
      .then(function() {
        return builder.build('test')
        .then((result) => {
          return run('test/simple-app/build/test/simple.exe', ['1','2','3'])
          .then(code=>{
            expect(code).to.eql(3);
          })
        })
      })
    })
  })
})

const {spawn} = require('child_process');
function run(cmd, args, env) {
  return new Promise((res, rej) => {
    let exe = spawn(cmd, args,env);
    exe.on('exit', code=> {
      res(code);
    });

    exe.on('error', rej);
    return exe;
  });
}
