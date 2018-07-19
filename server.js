const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose =require('mongoose');
const hbs = require('hbs');
const expressHbs = require('express-handlebars');
const config = require('./config/secret');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const falsh = require('express-flash');
const passport = require('passport');
const passportSocketIo = require('passport.socketio'); 
const cookieParser = require('cookie-parser');


const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const sessionStore = new MongoStore({ url: config.database, autoReconnect: true });
mongoose.connect(config.database, {useNewUrlParser: true }, function(err){
	if(err) {
		console.log(err);
	} else {
		console.log('Connected to Mlab');
	}
})

app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static(__dirname+'/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: config.secret,
	store: sessionStore
}))
app.use(falsh());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
	res.locals.user = req.user;
	next();
});


io.use(passportSocketIo.authorize({
	cookieParser: cookieParser,
	key: 'connect.sid',
	secret: config.secret,
	store: sessionStore,
	success: onAuthorizeSuccess,
	fail: onAuthorizeFail
}));

function onAuthorizeSuccess(data, accept) {
  console.log("successful connection");
  accept();
}

function onAuthorizeFail(data, message, error, accept) {
  console.log("failed connection");
  if (error) accept(new Error(message));
}


require('./realtime/io')(io);

//mongodb://<dbuser>:<dbpassword>@ds233551.mlab.com:33551/sanjeevtwitter
const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/user');
app.use(mainRoutes);
app.use(userRoutes);

http.listen(3030, (err) => {
	if(err) {
		console.log(err);
	} else {
		console.log(`Running on port ${3030}`);
	}

})