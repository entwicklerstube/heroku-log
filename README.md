# Heroku-log
> console.log wrapper for heroku-like logs

[![Build Status](https://travis-ci.org/entwicklerstube/heroku-log.svg?branch=master)](https://travis-ci.org/entwicklerstube/heroku-log)

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
import herokuLog, { error } from 'heroku-log'

// # On Heroku
herokuLog.info('Server is starting')
// 2017-05-24T08:58:42.857401+00:00 app[web.1] level=info message="Server is starting"

error(new Error('I am an error '))
// 2017-05-24T08:58:42.857401+00:00 app[web.1] level=error error="I am an error"
```
![](https://mjz.io/IQwXU.png)

### Tricks
Sometimes you don't want those logs e.g. when testing things, in this case you can pass a env variable in the command line and the module is muted
```
$ HEROKU_LOG=disable mocha test.js
```

### Timestamps
If the environment is not production `heroku-log` will add a simple time-mark at the beginning of each log, in production it will be hidden since Heroku adds a time block by itself.
