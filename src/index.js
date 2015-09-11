var getPathVar = require('./get-path-var');
var env = process.env;
module.exports = addToPath;

function addToPath(pathToAdd, options) {
  /* eslint complexity:[2, 6] */
  var platform, PATH, originalPath, pathArray;
  if (!isNonEmptyString(pathToAdd)) {
    throw new Error('path-to-add error: Must pass a non-empty string. You passed: ' + pathToAdd);
  }
  options = options || {};
  platform = options.platform || process.platform;
  PATH = getPathVar(platform);

  originalPath = env[PATH];
  pathArray = getPathArray(pathToAdd);


  if (env[PATH]) {
    pathArray.push(env[PATH]);
  }

  env[PATH] = pathArray.join(platform === 'win32' ? ';' : ':');

  return function restorePath() {
    env[PATH] = originalPath;
  };
}

function getPathArray(pathToAdd) {
  if (Array.isArray(pathToAdd)) {
    return pathToAdd;
  } else {
    return [pathToAdd];
  }
}
function isNonEmptyString(arg, noArrays) {
  if (!noArrays && Array.isArray(arg)) {
    return arg.every(a => isNonEmptyString(a, true));
  }
  return typeof arg === 'string' && arg.length > 0;
}

