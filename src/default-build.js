
module.exports = {
  "env": {
    //default include folders
    "include":["include"],
    // if a project name is supplied the build application may use it to guess a
    // name if one is not specifically supplied with a target
    "name": "",

    // the build data file version
    // may be useful in the future for compatibility
    "version": "0.0.1",

    //static libraries to link against
    "libs": [],
    "output": "./build"
  },

  // this must be overriden by the project build
  "targets": [
    /**
     * {
     *   "source": ["./src/*.cpp"],
     *   "output": "executable-name",
     *   "type": "executable",
     *   "cflags": "",
     *   "lflags": ""
     * },
     * {
     *   "source": ["./src/*.cpp"],
     *   "output": "library-name",
     *   "type": "static"
     * },
     * {
     *   "source": ["./src/*.cpp"],
     *   "output": "library-name",
     *   "type": "dynamic"
     * }
     */
  ],

  "profiles": {
    "debug": {
      "define": ["DEBUG"],
      "output": "+/debug"
    },
    "release": {
      "output": "+/release"
    }
  }
}
