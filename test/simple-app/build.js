

/**
 * The build script can be either a json file or a js file.
 *
 * If it is a js file it should set it may either set it's exports to a simple
 * json object, or it can return a function that will be called to retrieve the
 * build object. See another test file for it's example usage. It allows build
 * properties to be configured dynamically instead of static.
 *
 * @type {Object}
 */
const buildProperties = {
  profiles: [
    debug: {
      define: ['DEBUG'],

    }
  ]
};

module.exports = buildProperties;
