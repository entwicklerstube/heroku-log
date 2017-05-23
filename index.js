import pad from 'pad'
import chalk from 'chalk'

const isProduction = () => {
  return (process.env.NODE_ENV || '').toLowerCase() === 'production'
}

export const format = (object = {}, splitter = '=') => {
  return Object
    .keys(object)
    .map(key => `${key}${splitter}${typeof object[key] === 'object' ? `[${format(object[key], ':')}]` : object[key]}`)
    .join(' ')
}

export const parse = (log = '') => {
  return log
    .split(' ')
    .map(prop => ({ [prop.split('=')[0]]: prop.split('=')[1] }))
    .reduce((r, i) => ({ ...i, ...r }));
}

const logPrefix = args => {
  const hh = new Date().getHours()
  const mm = new Date().getMinutes()
  const ss = new Date().getSeconds()
  const time = chalk.gray(`[${hh}:${mm}:${ss}]`)

  const prop = args.find(a => a.level) || {}
  const level = (prop.level || '').toUpperCase()

  const chalkLevelColor = {
    INFO: 'white',
    DEBUG: 'cyan',
    ERROR: 'red',
    WARN: 'magenta',
    FATAL: 'red',
    TRACE: 'cyan'
  }

  const lvl = `${level.length > 0 ? chalk[chalkLevelColor[level]](`${pad(level + ' ', 10, '·')} `) : '' }`

  return [time, lvl].join(' ')
}

export const log = (...args) => {
  return (isProduction() ? '' : logPrefix(args)) + args
    .filter(({ level }) => isProduction() ? true : !level)
    .map(arg => {
      if (arg instanceof Error) {
        return arg.toString().replace(/^Error: /g, 'error=')
      } else if (typeof arg === 'string') {
        return `message=${arg}`
      } else if(Array.isArray(arg)) {
        return `message=${arg.join(', ')}`
      } else if (typeof arg === 'object') {
        return format(arg)
      }
    })
}

const stdout = (type = 'log', str = '') => {
  const logMessage = isProduction() ? str : str.replace(/message=/,'')
  console[type](logMessage)
}

export const info = (...args) => stdout('info', log(args, { level: 'info' }))
export const debug = (...args) => stdout('info', log(args, { level: 'debug' }))
export const error = (...args) => stdout('error', log(args, { level: 'error' }))
export const warn = (...args) => stdout('warn', log(args, { level: 'warn' }))
export const trace = (...args) => stdout('trace', log(args, { level: 'trace' }))
export const fatal = (...args) => stdout('error', log(args, { level: 'fatal' }))

export default { info, debug, error, warn, trace, fatal }
