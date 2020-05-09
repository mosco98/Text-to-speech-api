const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors({ origin: '*' }))
// app.use(express.static('public'))

// Controllers
const homeController = require('./routes')

// Routes
app.get('/voices', homeController.getVoices)
app.post('/convert', homeController.convertText)
app.get('/stream', homeController.stream)

const port = process.env.PORT || 8080

app.listen(port, () => console.log(`App is running on port ${port}`))
