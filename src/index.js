const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const favicon = require('serve-favicon')
const path = require('path');

//Inicialización
const app = express();

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
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//Variables Globales
app.use((req,res,next)=>{
    next();
})

//Rutas
app.use(require('./routes/'));
app.use(require('./routes/auth'));
var catalogRouter = require('./routes/comercios');
app.use('/comercios', catalogRouter);
var catalogRouter2 = require('./routes/contador');
app.use('/contador', catalogRouter2);

//Public
app.use(express.static(path.join(__dirname,'/public')));

//Iniciar Servidor
app.listen(app.get('port'), ()=>{
    console.log('Server listening on port ',app.get('port'));
});