const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const favicon = require('serve-favicon')
const path = require('path');
const session= require('express-session');
const flash = require('connect-flash');
const mysql_store = require('express-mysql-session');
const {database} = require('./keys');
const passport = require('passport');

//Inicialización
const app = express();
require('./lib/passport');

//Configuraciones
app.set('port',process.env.PORT||3000);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs.engine({
        defaultLayout:'main',
        layoutsDir: path.join(app.get('views'),'layouts'),
        partialsDir:path.join(app.get('views'),'partials'),
        extname:'.hbs',
        helpers: require('./lib/handlebars')
}));
app.set('view engine','.hbs');


//Middlewares
app.use(session({
    secret: 'session',
    resave: false,
    saveUninitialized: false,
    store: new mysql_store(database)
}))
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(passport.initialize());
app.use(passport.session());


//Variables Globales
app.use((req,res,next)=>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    next();
})

//Rutas
app.use(require('./routes/'));
app.use(require('./routes/auth'));
var catalogRouter = require('./routes/comercios');
app.use('/comercios', catalogRouter);
var catalogRouter2 = require('./routes/contador');
const { allowedNodeEnvironmentFlags } = require('process');
app.use('/contador', catalogRouter2);

//Public
app.use(express.static(path.join(__dirname,'/public')));

app.use((req, res, next) => {
    res.status(404).render('general/404');
})

//Iniciar Servidor
app.listen(app.get('port'), ()=>{
    console.log('Server listening on port ',app.get('port'));
});