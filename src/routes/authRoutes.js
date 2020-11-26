const express = require('express');
const chalk = require('chalk');
const mongoClient  = require('mongodb').MongoClient;
const debug = require('debug')('app:bookRoutes');
const passport = require('passport');

const authRouter = express.Router();

function router(nav) {
  authRouter.route('/signUp')
    .post((req,res) => {
      // Create user
      const { username, password } = req.body;
      const url = 'mongodb://localhost:27017';
      const dbName = 'E-library';

      (async function addUser() {
        let client;
        try {
          client = await mongoClient.connect(url);
          debug(chalk.blue('Connected correctly to server'));
  
          const db = client.db(dbName);
  
          const col = db.collection('users');
          const user = { username, password };
          const results = await col.insertOne(user);
          debug(results.ops[0]);
          // Login user
          req.login(results.ops[0], () => {
            res.redirect('/auth/profile');
          });

        } catch (err) {
          debug(err);
        }
        // Close connection
        client.close();
      }());
      
      
    });

  authRouter.route('/signin')
  .get((req,res) => {
    res.render('signin',  {
      nav,
      title: 'Sign In'
    });
  })
  .post(passport.authenticate('local', {
    successRedirect: '/auth/profile',
    failureRedirect: '/'
  }))

  authRouter.route('/profile')
  .all((req, res, next) => {
    if(req.user) {
      next();
    } else{
      res.redirect('/');
    }
  })
  .get((req,res) => {
    res.json(req.user);
  });


    return authRouter;

};

module.exports = router;