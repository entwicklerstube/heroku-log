import { expect } from 'chai'
import chalk from 'chalk'

import herokuLog, { format, log, parse, info, debug, error, warn, trace, fatal, mergeStringsAndArrays, addDoubleQuotesIfStringHasWhitespaces } from './index'

describe('heroku-log', () => {
  beforeEach(() => {
    process.env.NODE_ENV = undefined
  })

  it('sub imports are working', () => {
    console.info = () => {}
    console.error = () => {}
    console.warn = () => {}
    console.trace = () => {}

    expect(() => {
      info('This', { some: 'important' })
      debug('If this happens you should take a look...')
      error('oh my gosh, there is a error')
      warn('oh wait.. what is this?')
      trace('trace the f out of it')
      fatal('honestly? fatal doesnt sound like something i want to see.. :S')
    }).to.not.throw()
  })

  describe('format', () => {
    it('returns a string', () => {
      expect(format()).to.be.a('string')
    })

    it('returns a string with heroku like format of passed object', () => {
      expect(format({ hello: 'world' })).to.equal('hello=world')
    })

    it('returns a multiple props in a object in heroku like format', () => {
      expect(format({ hello: 'world', foo: 'bar' })).to.equal('hello=world foo=bar')
    })
  })

  describe('parse', () => {
    it('returns a object', () => {
      expect(parse()).to.be.a('object')
    })

    it('returns the prop of the passed heroku-like format in an object', () => {
      expect(parse('hello=world')).to.deep.equal({ hello: 'world' })
    })

    it('returns the prop of a object with multiple props of the passed heroku-like format in an object', () => {
      expect(parse('hello=world foo=bar mambo=nr.5')).to.deep.equal({ hello: 'world', foo: 'bar', mambo: 'nr.5' })
    })

    it('returns the prop with double-quotes of a object with multiple props of the passed heroku-like format in an object', () => {
      expect(parse('foo="hello world"')).to.deep.equal({ foo: 'hello world' })
    })
  })

  describe('log', () => {
    describe('production enviroment', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'production'
      })

      it('returns a string', () => {
        expect(log()).to.be.a('string')
      })

      it('returns a single string as message', () => {
        expect(log('hello world')).to.equal('message="hello world"')
      })

      it('returns a array comma-seperated as message', () => {
        expect(log([ 'mozart', 'beethoven' ])).to.equal('message="mozart, beethoven"')
      })

      it('returns a passed object splitted by props with the format function', () => {
        expect(log({ hello: 'world' })).to.equal('hello=world')
      })

      it('returns a deep object with a similary syntax but a : instead of =', () => {
        expect(log({ hello: 'world', foo: { bar: 'baz' } })).to.equal('hello=world foo=[bar:baz]')
      })

      it('returns a Error in a error', () => {
        expect(log(new Error('This is an error'))).to.equal('error=This is an error')
      })

      it('returns a combination of string and object', () => {
        expect(log('foo', { hello: 'world' })).to.equal('message=foo hello=world')
      })

      it('returns a combination of string and multie object', () => {
        expect(log('foo', { hello: 'world', foo: { hello: 'world' } })).to.equal('message=foo hello=world foo=[hello:world]')
      })

      it('returns a combination of string and array', () => {
        expect(log('foo', ['bar'], { hey: 'you!' })).to.equal('message="foo, bar" hey=you!')
      })
    })

    describe('non-production enviroment', () => {
      it('returns a string, starting with the timestamp', () => {
        const hh = new Date().getHours()
        const mm = new Date().getMinutes()
        const ss = new Date().getSeconds()

        expect(log('some message')).to.equal(`${chalk.gray(`[${hh}:${mm}:${ss}]`)} message="some message"`)
      })
    })
  })

  describe('mergeStringsAndArrays', () => {
    it('returns an array', () => {
      expect(mergeStringsAndArrays()).to.be.a('array')
    })

    it('returns a passed array and return it in the response', () => {
      expect(mergeStringsAndArrays(['foo'])).to.deep.equal([['foo']])
    })

    it('returns a passed string and return it in the response as array', () => {
      expect(mergeStringsAndArrays('hello world')).to.deep.equal([['hello world']])
    })

    it('returns multple passed strings and return them in the response as array', () => {
      expect(mergeStringsAndArrays('hello world', 'foobar')).to.deep.equal([['hello world', 'foobar']])
    })

    it('returns a mix of passed props and return them in the response as array', () => {
      expect(mergeStringsAndArrays('foo', 'baz', ['hello world', 'foobar'])).to.deep.equal([['foo', 'baz', 'hello world', 'foobar']])
    })

    it('returns a mix of passed props and return them in the response as array', () => {
      expect(mergeStringsAndArrays([ 'foo', [ 'bar' ], { hey: 'you!' } ])).to.deep.equal([['foo', 'bar'], { hey: 'you!' }])
    })
  })

  describe('addDoubleQuotesIfStringHasWhitespaces', () => {
    it('returns a string', () => {
      expect(addDoubleQuotesIfStringHasWhitespaces()).to.be.a('string')
    })

    it('returns a single word without double-quotes', () => {
      expect(addDoubleQuotesIfStringHasWhitespaces('hello')).to.equal('hello')
    })

    it('returns multple passed words with double-quotes', () => {
      expect(addDoubleQuotesIfStringHasWhitespaces('hello world')).to.equal('"hello world"')
    })
  })
})
