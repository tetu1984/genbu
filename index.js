
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mysql = require('mysql')
  , sys = require ('sys');

var app = express();

var client = mysql.createConnection({
  host : 'db_host',
  port : 'db_post',
  user : 'db_user',
  password : 'db_pass',
  database : 'db_name',
  debug : true,
  insecureAuth: true
});

var dbcrud  = require('dbcrud').init(client, 'db_name', {
  families: {
    id: { name: 'id', type: 'id' },
    name: { name: 'name', type: 'varchar(64)', orderBy: true },
    notes: { name: 'notes', type: 'varchar(255)' }
  },
  people: {
    id: { name: 'id', type: 'id' },
    name: { name: 'name', type: 'varchar(64)', nullable: true, orderBy: true },
    family: { name: 'family', type: 'families' }
  }
});

app.configure(function(){
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

dbcrud.addRoutes(app);

