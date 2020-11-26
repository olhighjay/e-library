const passport = require('passport');
const { Strategy } = require('passport-local');
const mongoClient  = require('mongodb').MongoClient;
const debug = require('debug')('app:local.strategy');
const chalk = require('chalk');

module.exports = function localStrategy() {
  passport.use(new Strategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    }, (username, password, done) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'E-library';

      (async function mongo() {
        let client;
        try {
          client = await mongoClient.connect(url);
          debug(chalk.blue('Connected correctly to server'));
  
          const db = client.db(dbName);
  
          const col = db.collection('users');

          const user = await col.findOne({username});
          if(user)
          {
            if (user.password === password) {
              done(null, user);
            } else {
              debug(chalk.red('Wrong login details'));
              done(null, false);
            }
          } else {
            debug(chalk.red('Invalid Username'));
            done(null, false);
          }
      
        } catch (err) {
          debug(err.stack);
        }
        // Close connection
        client.close();
      }());
      }
  ));
};