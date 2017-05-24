import pad from 'pad'
import chalk from 'chalk'

const chalkLevelColor = {
  INFO: 'white',
  DEBUG: 'cyan',
  ERROR: 'red',
  WARN: 'magenta',
  FATAL: 'red',
  TRACE: 'cyan'
}

const isProduction = () => {
  return (process.env.NODE_ENV || '').toLowerCase() === 'production'
}

export const format = (object = {}, splitter = '=') => {
  return Object
    .keys(object)
    .map(key => `${key}${splitter}${typeof object[key] === 'object' ? `[${format(object[key], ':')}]` : addDoubleQuotesIfStringHasWhitespaces(object[key])}`)
    .join(' ')
}

export const parse = (log = '') => log
    .replace(/".+(\s)[a-z]+"/, ($1, $2) => $1.replace(/\s/g,'__HEROKU_LOG_WHITESPACE_SPLITTER__'))
    .replace(/"/g, '')
    .split(' ')
    .map(prop => {
      return ({ [prop.split('=')[0]]: (prop.split('=')[1] || '').replace(/__HEROKU_LOG_WHITESPACE_SPLITTER__/g, ' ') })
    })
    .reduce((r, i) => ({ ...i, ...r }));

const logPrefix = args => {
  const hh = new Date().getHours()
  const mm = new Date().getMinutes()
  const ss = new Date().getSeconds()
  const time = chalk.gray(`[${hh}:${mm}:${ss}]`)

  const prop = args.find(a => a.level) || {}
  const level = (prop.level || '').toUpperCase()

  const lvl = `${Object.keys(chalkLevelColor).includes(level) ? chalk[chalkLevelColor[level]](`${pad(level + ' ', 10, '·')} `) : '' }`

  return [time, lvl].join(' ')
}

export const mergeStringsAndArrays = (...args) => {
  let response = []

  if (Array.isArray(args) && args.length === 1 && Array.isArray(args[0])) {
    args = args[0]
  }

  args
    .filter(arg => typeof arg === 'string' || Array.isArray(arg))
    .map(arg => {
      if (Array.isArray(arg)) {
        response = response.concat(arg)
      } else {
        response.push(arg)
      }
    })

  return [response].concat(args.filter(arg => (typeof arg !== 'string' && !Array.isArray(arg))))
}

export const addDoubleQuotesIfStringHasWhitespaces = (string = '') => {
  return /\s/.test(string) ? `"${string}"` : string
}

export const log = (...args) => {
  return (isProduction() ? '' : logPrefix(args)) + mergeStringsAndArrays(args)

  .filter(({ level }) => isProduction() ? true : !level)
  .map(arg => {
    if (arg instanceof Error) {
      return arg.toString().replace(/^Error: /g, 'error=')
    } else if (typeof arg === 'string' && arg.length > 0) {
      return `message=${addDoubleQuotesIfStringHasWhitespaces(arg)}`
    } else if(Array.isArray(arg) && arg.length > 0) {
      return `message=${addDoubleQuotesIfStringHasWhitespaces(arg.join(', '))}`
    } else if (typeof arg === 'object') {
      return format(arg)
    }
  })
  .filter(a => a.length > 0)
  .join(' ')}

const stdout = (type = 'log', str = '') => {
  const logMessage = isProduction() ? str : str.replace(/message="([^"]+)"/, ($1, $2) => $2)
  console[type](logMessage)
}

export const info = (...args) => stdout('info', log(...args, { level: 'info' }))
export const debug = (...args) => stdout('info', log(...args, { level: 'debug' }))
export const error = (...args) => stdout('error', log(...args, { level: 'error' }))
export const warn = (...args) => stdout('warn', log(...args, { level: 'warn' }))
export const trace = (...args) => stdout('trace', log(...args, { level: 'trace' }))
export const fatal = (...args) => stdout('error', log(...args, { level: 'fatal' }))

export default { info, debug, error, warn, trace, fatal }
