# Heroku-log
> Console.log wrapper for heroku-like logs

[![Zero Dependencies](https://img.shields.io/badge/zero-dependencies-brightgreen.svg)]()
[![Build Status](https://travis-ci.org/entwicklerstube/heroku-log.svg?branch=master)](https://travis-ci.org/entwicklerstube/heroku-log)
![npm total downloads](https://img.shields.io/npm/dt/b3m.svg)

### Install
**yarn**
```
yarn add heroku-log
```

**npm**
```
npm install heroku-log --save
```

### Available levels
```js
import {
  info,
  debug,
  error,
  warn,
  trace,
  fatal
} from 'heroku-log'
```

### Example
```js
import log, { error } from 'heroku-log'

// # On Heroku
log.info('Server is starting')
// level=info message=Server is starting level=info

error(new Error('I am an error '))
// level=error error=I am an error

// # On a non-production environment
log.info('This is a log')
// [13:37:42] level=info message=This is a log
```

### Timestamps
If the environment is not production `heroku-log` will add a simple time-mark at the beginning of each log, in production it will be hidden since Heroku adds a time block by itself.
