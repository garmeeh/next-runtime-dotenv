const dotenv = require('dotenv')
const {PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER} = require('next/constants')

function exposeKeys(keys) {
  if (!Array.isArray(keys)) {
    throw new TypeError('The `server` and `public` keys should be arrays of env variables to expose')
  }

  return keys.reduce((acc, key) => {
    acc[key] = process.env[key]

    return acc
  }, {})
}

module.exports = opts => {
  opts = {
    path: '.env',
    server: [],
    public: [],

    ...opts
  }

  return (config = {}) => (phase, args) => {
    if (typeof config === 'function') {
      config = config(phase, args)
    }

    if (phase === PHASE_PRODUCTION_SERVER || phase === PHASE_DEVELOPMENT_SERVER) {
      dotenv.config({
        path: opts.path
      })

      return ({
        ...config,

        serverRuntimeConfig: {
          ...config.serverRuntimeConfig,
          ...exposeKeys(opts.server)
        },
        publicRuntimeConfig: {
          ...config.publicRuntimeConfig,
          ...exposeKeys(opts.public)
        }
      })
    }

    return config
  }
}
