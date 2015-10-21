const getPathVar = require('./get-path-var')
module.exports = addToPath

function addToPath(
  env,
  pathToAdd,
  {
    append = false,
    platform = process.platform,
  }
    =
    {
      append: false,
      platform: process.platform,
    }
) {
  let PATH, originalPath, pathArray
  if (typeof env !== 'object') {
    throw new Error('add-to-path error: must provide an env to manipulate')
  }
  if (!isNonEmptyString(pathToAdd)) {
    throw new Error('add-to-path error: Must pass a non-empty string. You passed: ' + pathToAdd)
  }
  PATH = getPathVar(env, platform)

  originalPath = env[PATH]
  pathArray = getPathArray(pathToAdd)

  addExistingPath(pathArray, env[PATH], append)

  env[PATH] = pathArray.join(platform === 'win32' ? ';' : ':')

  return function restorePath() {
    env[PATH] = originalPath
  }
}

function getPathArray(pathToAdd) {
  if (Array.isArray(pathToAdd)) {
    return pathToAdd
  } else {
    return [pathToAdd]
  }
}

function addExistingPath(array, path, appendMode) {
  if (!path) {
    return
  }
  if (appendMode) {
    array.unshift(path)
  } else {
    array.push(path)
  }
}

function isNonEmptyString(arg, noArrays) {
  if (!noArrays && Array.isArray(arg)) {
    return arg.every(a => isNonEmptyString(a, true))
  }
  return typeof arg === 'string' && arg.length > 0
}

