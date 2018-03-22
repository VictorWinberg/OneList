// index.js
const express = require('express')

const app = express()

app.use(express.static('build'))

app.listen(3004, () => console.log('ShoppingList app listening on port 3004!'))