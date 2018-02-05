// index.js
const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('<h1>ShoppingList!</h1>'))

app.listen(3004, () => console.log('ShoppingList app listening on port 3004!'))