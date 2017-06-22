const { config, articles } = require('./utils')

const { apiPrefix } = config
const database = articles

module.exports = {

  [`GET ${apiPrefix}/articles`](req, res) {
    const { query } = req
    let {
      limit,
      offset,
    } = query

    limit = Number(limit || 10)
    offset = Number(offset || 0)

    const data = database.slice(offset, offset + limit)

    res.status(200).json({
      list: data,
      total: database.length,
    })
  },
}
