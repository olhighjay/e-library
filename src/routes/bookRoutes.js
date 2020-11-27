const express = require('express');
const chalk = require('chalk');
const mongoClient  = require('mongodb').MongoClient;
const ObjectID  = require('mongodb').ObjectID;
const debug = require('debug')('app:bookRoutes');
const bookController = require('../controllers/bookController.js');

const bookRouter = express.Router();
const bookService = require('../services/goodreadsService.js');

function router(nav) {
  const { getIndex } = bookController(bookService, nav);
  const { getById } = bookController(bookService, nav);
  const { middleware } = bookController(bookService, nav);
  bookRouter.use(middleware);
  bookRouter.route('/')
    .get(getIndex);

    bookRouter.route('/:id')
    .get(getById);

  return bookRouter;
}
  module.exports = router;