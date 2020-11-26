const express = require('express');
const chalk = require('chalk');
const mongoClient  = require('mongodb').MongoClient;
const ObjectID  = require('mongodb').ObjectID;
const debug = require('debug')('app:bookRoutes');

const bookRouter = express.Router();

function router(nav) {
  bookRouter.use((req, res, next) => {
    if(req.user) {
      next();
    } else{
      res.redirect('/');
    }
  });
  bookRouter.route('/')
    .get((req, res) => {
      
      const url = 'mongodb://localhost:27017';
      const dbName = 'E-library';
      debug(mongoClient);

      (async  function mongo(){
        let client;
        try {
          client = await mongoClient.connect(url);
          debug(chalk.blue('Connected correctly to server'));

          const db = client.db(dbName);

          const col = await db.collection('books');

          const books = await col.find().toArray();
          debug(books);
          res.render('books', {
            nav,
            title: 'E-Library',
            books
          });
        } catch (err){
          debug(err.stack);
        }
        client.close();
      }());
    });

    bookRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      const url = 'mongodb://localhost:27017';
      const dbName = 'E-library';

      (async function jay(){
        let client;
        try {
          client = await mongoClient.connect(url);
          debug(chalk.blue('Connected correctly to server'));

          const db = client.db(dbName);

          const col = await db.collection('books');

          //get the first record
          const book = await col.findOne({_id: new ObjectID(id) })
          debug(book);
          
          res.render('book', {
            nav,
            title: 'E-Library',
            book
          });
        } catch (err) {
          debug(err.stack);
        }
      }())
    });
  return bookRouter;
}
  module.exports = router;