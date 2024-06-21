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

app.post('/login', (req, res) => {
  User.findOne({email: req.body.email}).then((user) => {
    if (!user) {
      res.status(404).send({message: 'User Not Found'});
    }

    bcrypt.compare(req.body.password, user.password).then( match => {
      if(!match){
       return res.status(401).send({message: 'Incorrect Password'});
      }

      const token = jwt.sign({email: user.email, userId: user._id}, secret, {expiresIn: '1h'});

      res.status(200).send({message: 'User logged in!', email: user.email, token: token});
    })
  }).catch(err => {
    res.status(500).send({message: 'Something went wrong', error: err});
  })
})

const authenticate = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(401).send({message: 'Incorrect Token'});
    }
    req.userData = decoded;
    next()
  })
}

app.get('/user/quotes', authenticate, (req, res) => {
  Quote.find({user: req.userData.userId}).then((quotes) => {
    res.status(200).json(quotes);
  }).catch(err => {
    res.status(500).send({message: 'Something went wrong', error: err});
  })
})

app.post('/user/quotes', authenticate, (req, res) => {
  const newQuote = new Quote({
    content: req.body.content,
    user: req.userData.userId
  })


  newQuote.save().then(result => {
    User.findById(req.userData.userId).then((user) => {
      user.quotes.push(result._id)
      user.save().then(() => {
        res.status(200).send({message: 'Quote saved successfully!', quote: result});
      }).catch(err => {
        res.status(500).send({message: 'Something went wrong', error: err});
      })
    }).catch(err => {
      res.status(500).send({message: 'Something went wrong', error: err});
    })
  }).catch(err => {
    res.status(500).send({message: 'Something went wrong', error: err});
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
