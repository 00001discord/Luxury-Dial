/*const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const bodyParser = require('body-parser');

const User = require('./models/User');
const app = express();

// DB connection
mongoose.connect('mongodb://127.0.0.1:27017/miapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error(err));

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secreto_super_seguro',
    resave: false,
    saveUninitialized: false
}));

// Registro
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hash });
    await user.save();
    req.session.user = user;
    res.redirect('/');
});

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).send('Credenciales inválidas');
    }

    req.session.user = user;
    res.redirect('/');
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Obtener usuario logueado
app.get('/user-info', (req, res) => {
    if (req.session.user) {
        res.json({ username: req.session.user.username });
    } else {
        res.json({ username: null });
    }
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});*/
