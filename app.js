const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');


const nav= [
  {title:'Books', link: 'books'},
  {title: 'Authors', link: 'authors'}
];

const config = {
  user: 'olhighjay',
  password: 'symplySimi34',
  server: 'olhighjay.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
  database: 'E-library',
};

sql.connect(config).catch((err) => debug(err));

const app = express();
const port = process.env.PORT || 3000;
const bookRouter = require('./src/routes/bookRoutes')(nav);

app.use(morgan('tiny'));

app.use((req, res, next) => {
  debug('I am great dveloper');
  next();
});
app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');



  app.use('/books', bookRouter);
app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, '/views/', '/index.html'));
  res.render('index', 
  {
    nav:[
      {title:'Books', link: 'books'},
      {title: 'Authors', link: 'authors'}
    ],
    title: 'E-Library'
  });
});


app.listen(port, () => {
  debug(`Server is running on ${chalk.green(port)}`);
});