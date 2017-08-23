var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var mongoose = require('mongoose');
var config = require('./config/database');

//Conectar a la BD
mongoose.connect(config.database);
//Verificar si conecta o no a la BD
mongoose.connection.on('connected', () => {
    console.log('Conectado a la BD '+config.database);
});
mongoose.connection.on('error', (err) => {
    console.log('Error al conectar a la BD '+err);
});

var app = express();
var port = 3000;

//Rutas de usuario
var users = require('./routes/users');

//es un middleware
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);


//localhost/users/
app.use('/users', users);

app.get('/', (req, res) => {
    res.send('Servidor encendido');
});

//Ya que hicimos el ng build en angular2
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


app.listen(port, (req, res) => {
    console.log('Server listen on port '+port);
});