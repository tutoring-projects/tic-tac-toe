const express = require('express')
const app = express()

app.use(express.static('public'))

app.listen(80)

require('./ws')

console.log('Listening on port 80')