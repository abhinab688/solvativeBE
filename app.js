const express = require('express');
const app = express();
const dotenv = require('dotenv')
var cors = require('cors');
app.use(cors())

dotenv.config()
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user');
app.use(bodyParser.json())


app.use(userRoutes)

app.listen(8000)