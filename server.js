const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cors = require('cors')
const User = require('./src/models/user');
const Quote = require('./src/models/quote');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const app = express();

const uri = "mongodb+srv://your_link";


const secret = "your_secret_secret";

app.use(bodyParser.json())
app.use(cors());


app.post('/signup', (req, res) => {
  bcrypt.hash(req.body.password, 10).then( hash => {
    const newUser = new User({
      email: req.body.email,
      password: hash,
    })

    newUser.save().then(result => {
      const token = jwt.sign({email: newUser.email, userId: result._id}, secret, {expiresIn: '1h'});
      res.status(200).send({message: 'User Created', email: result.email,  token: token});
    }).catch(err => {
      res.status(500).send({message: 'Something went wrong', error: err});
    })
  })
})

mongoose.connect(uri, {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true
  }
}).then(() => app.listen(3000)).catch((error) => {
  console.error('Database error', error);
});
