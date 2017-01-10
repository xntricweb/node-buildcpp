#! /usr/bin/env node
//const builder = require('../src/builder.js')();

let mode = process.argv[2];
let profile = process.argv[3];
let target = process.argv[4];

if (mode === '/?' || mode === '-h' || mode === '--help') {
  printHelp();
  process.exit();
}

if (!(mode == 'clean' || mode == 'build')) {
  target = profile;
  profile = mode;
  mode = 'build';
}

if (!target) target = process.cwd();


require('../src/builder.js')().then((builder) => {
  projectLoader(target)()
  .catch(projectLoader(profile))
  .catch(projectLoader(process.cwd()))
  .then((builder) => {
    console.log("Project loaded\n\n");
    let profiles = Object.keys(builder.profiles);
    if (profiles.indexOf(profile) === -1 && profiles.length) {
      profile = profiles[0];
    } else {
      profile = false;
    }

    console.log("Building profile: %s", profile);

    return builder.build(profile);
  }, failedProjectLoad)
  .then(() => {console.log('Build OK')}, failedBuild);

  function projectLoader(target) {
    return function(err) {
      if (err) {
        console.log("No project found.")
      }
      console.log('Looking for project at %s', target);
      return builder.loadProject(target);
    }
  }

  function failedProjectLoad(err) {
    console.log("Failed to load project!\n");
    printHelp();
    process.exit(-2);
  }

  function failedBuild(err) {
    console.log('Build Failed!');
    process.exit(-1);
  }
})

function printHelp() {
  console.log('usage:');
  console.log('build [clean] [profile] [target]');
  console.log('If a target is not specified the current directory is searched for a build file.');
  console.log('If unspecified the first available profile is used to build.');
  console.log('This is probably "release" unless a different configuration is created by the build script.')
}
