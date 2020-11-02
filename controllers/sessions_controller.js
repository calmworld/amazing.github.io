//===========================
// DEPENDENCIES
//===========================
const bcrypt = require('bcrypt');
const express = require('express')
const sessions = express.Router();

const methodOverride = require('method-override'); //include the method-override package
sessions.use(methodOverride('_method'));
//=================
// Models
//=================

const User = require('../models/users.js');



//===========================
// ROUTS
//===========================
sessions.get('/new', (req, res) => {
  res.render('sessions/new.ejs', { 
    currentUser: req.session.currentUser 
  });
});


sessions.post('/', (req, res) => {
  User.findOne({ username: req.body.username }, (err, foundUser) => {
    if (err) {
      console.log(err)
      res.send('There was an issue with the DB')
    } else if (!foundUser) {
      res.send('<a href="/">Sorry, no user found</a>')
    } else {
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        req.session.currentUser = foundUser
        res.redirect('/')
      } else {
        res.send('<a href="/"> password does not match </a>')
      }
    }
  })
})

sessions.delete('/', (req, res) => {
  console.log(req.session)
  req.session.destroy(() => {
    res.redirect('/')
  })
})

//=================
// EXPORTS
//=================
module.exports = sessions