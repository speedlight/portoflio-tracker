const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const express = require('express')
const http    = require('http')
const path    = require('path')
const axios   = require('axios')
const pouchdb = require('pouchdb')

const app = express()
const port = 3000
const db = new pouchdb('assets')

app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))

// Prices function
async function pricesQuery(query) {
  const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${query}%2C&vs_currencies=usd`,)
  return res.data
}
app.get('/prices', async (req, res, next) => {
  try {
    const prices = query = req.query.q
    const results = await pricesQuery(query)

    res.status(200).render('prices', {
      title: 'Prices tracker',
      results: results,
      query,
    })
  } catch (err) {
    next(err)
  }
})

// Assets function
db.bulkDocs([
  {
  "_id": "btc",
  "network": "Bitcoin",
  "hodl": "0.12345678",
  "avg_price": "19486"
  },{
  "_id": "atom",
  "network": "Cosmos",
  "hodl": "23.4",
  "avg_price": "10.35"
  },{
  "_id": "matic",
  "network": "Poligon",
  "hodl": "156",
  "avg_price": "0.84"
  },{
  "_id": "eth",
  "network": "Ethereum",
  "hodl": "2",
  "avg_price": "1024"
  },
])

db.info().then(function (info) {
  console.log('DB: ' + info.db_name)
}).then(function () {
  return db.allDocs()
}).then(function (res) {
  const json = res
  console.log(res)
}).catch(function (err) {
  console.log(err)
})

app.get('/assets', async (req, res, next) => {
  try {
    const prices = req.query.q
    const results = await assetsQuery(query)

    res.status(200).render('assets', {
      title: 'Assets tracker',
      results: results,
      query,
    })
  } catch (err) {
    next(err)
  }
})

app.get('/', (req, res) => {
  res.status(200).render('default')
})
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started at: ${server.address().port}`)
})
