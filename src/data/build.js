const timestamp = new Date()
const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  NODE_ENV: ['development', 'production'].includes(process.env.NODE_ENV)
    ? process.env.NODE_ENV
    : 'development',
  isDev,
  timestamp: timestamp,
  id: timestamp.valueOf(),
}
