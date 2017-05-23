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

export const log = (...args) => {
  const { NODE_ENV = '' } = process.env
  const hh = new Date().getHours()
  const mm = new Date().getMinutes()
  const ss = new Date().getSeconds()

  return (NODE_ENV.toLowerCase() === 'production' ? '' : `[${hh}:${mm}:${ss}] `) + args
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
    .join(' ')
}

const stdout = (type = 'log', string = '') => {
  console[type](string)
}

export default {
  info: (...args) => stdout('info', log(args, { level: 'info' })),
  debug: (...args) => stdout('info', log(args, { level: 'debug' })),
  error: (...args) => stdout('error', log(args, { level: 'error' })),
  warn: (...args) => stdout('warn', log(args, { level: 'warn' })),
  trace: (...args) => stdout('trace', log(args, { level: 'trace' })),
  fatal: (...args) => stdout('error', log(args, { level: 'fatal' }))
}
