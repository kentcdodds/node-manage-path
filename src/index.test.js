import chai from 'chai'
import addToPath from './index'
import getPathVar from './get-path-var'

const expect = chai.expect
const PATH = getPathVar()

chai.use(require('chai-string'))

describe('add-to-path', () => {
  let env, add
  const pathToAdd = '/foo/bar/.bin'
  const pathsToAdd = [pathToAdd, '/baz/foobar/.bin'] // for when multiple are needed

  beforeEach(() => {
    env = {PATH: '/usr/bin'}
    add = addToPath.bind(null, env)
  })

  describe('platform independent', () => {
    it(`should throw an error when not given an env`, () => {
      expect(() => {
        addToPath()
      }).to.throw(/must provide an env to manipulate/)
    })

    it('should throw an error when passed a non-string', () => {
      expect(() => {
        add()
      }).to.throw(/must pass a non-empty string/ig)
    })

    it('should throw an error when passed an empty string', () => {
      expect(() => {
        add(2)
      }).to.throw(/must pass a non-empty string/ig)
    })

    it('should return a function to restore the path', () => {
      const restorePath = add(pathToAdd)
      expect(env[PATH]).to.startWith(pathToAdd)
      restorePath()
      expect(env[PATH]).to.not.contain(pathToAdd)
    })

    it('should handle the case where there is no pre-existing path', () => {
      delete env[PATH]
      add(pathToAdd)
      expect(env[PATH]).to.equal(pathToAdd)
    })

    it('should handle an array of strings', () => {
      const platform = 'darwin'
      const separator = ':'
      const paths = [pathToAdd, '/bar/foo/.bin']
      add(paths, {platform})
      expect(env[PATH]).to.startWith(paths.join(separator))
    })

    it('should allow you to append to the path', () => {
      add(pathToAdd, {append: true})
      expect(env[PATH]).to.endWith(pathToAdd)
    })
  })

  describe('on darwin platform', () => {
    const platform = 'darwin'
    const separator = ':'

    it('should alter the path to add what is provided', () => {
      expect(add(pathsToAdd, {platform}))
      expect(env[PATH]).to.startWith(pathToAdd + separator)
    })
  })

  describe('on win32 platform', () => {
    const platform = 'win32'
    const separator = ';'

    it('should alter the path to add what is provided', () => {
      env = {Path: '/usr/bin'}
      expect(addToPath(env, pathsToAdd, {platform}))
      expect(env.Path).to.startWith(pathToAdd + separator)
    })
  })
})

