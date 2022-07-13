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

// dummy portfolio directly to pouchdb
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

//
// For console
//
db.allDocs({include_docs: true}).then(function (res) {
  const json = res.rows
}).catch(function (err) {
  console.log(err)
})

// Prices function
async function pricesQuery(query) {
  const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${query}%2C&vs_currencies=usd`,)
  return res.data
}

app.get('/', async function(req, res, next) {
  try {
    const query = req.query.q
    const pricesResults = await pricesQuery(query)
    const assetsResults = await db.allDocs({include_docs: true})

    console.log(query)
    console.log(pricesResults)
    console.log(assetsResults)

    let locals = {
      title: 'Crypto Portfolio Tracker',
      pricesResults: pricesResults,
      assetsResults: assetsResults.rows,
      query: query,
    }
    res.status(200).render('app', locals)
  } catch (err) {
    next(err)
  }
})
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started at: ${server.address().port}`)
})
