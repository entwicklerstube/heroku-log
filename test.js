import { expect } from 'chai'
import chalk from 'chalk'

import herokuLog, { format, log, parse, info, debug, error, warn, trace, fatal } from './index'

describe('heroku-log', () => {
  beforeEach(() => {
    process.env.NODE_ENV = undefined
  })

  it('sub imports are working', () => {
    // disable logging in this test
    console.info = () => {}
    console.error = () => {}
    console.warn = () => {}
    console.trace = () => {}

    expect(() => {
      info('This is a small information log')
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
        expect(log('hello world')).to.deep.equal('message=hello world')
      })

      it('returns a array comma-seperated as message', () => {
        expect(log([ 'mozart', 'beethoven' ])).to.deep.equal('message=mozart, beethoven')
      })

      it('returns a passed object splitted by props with the format function', () => {
        expect(log({ hello: 'world' })).to.deep.equal('hello=world')
      })

      it('returns a deep object with a similary syntax but a : instead of =', () => {
        expect(log({ hello: 'world', foo: { bar: 'baz' } })).to.deep.equal('hello=world foo=[bar:baz]')
      })

      it('returns a Error in a error', () => {
        expect(log(new Error('This is an error'))).to.deep.equal('error=This is an error')
      })
    })

    describe('non-production enviroment', () => {
      it('returns a string, starting with the timestamp', () => {
        const hh = new Date().getHours()
        const mm = new Date().getMinutes()
        const ss = new Date().getSeconds()

        expect(log('some message')).to.equal(`${chalk.gray(`[${hh}:${mm}:${ss}]`)} message=some message`)
      })
    })
  })
})
