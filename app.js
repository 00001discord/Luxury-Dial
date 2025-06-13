
const paymentRoutes = require('./public/routes/payment.js');
const morgan = require('morgan');

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const helmet = require('helmet');
const cors = require('cors');
const mercadopago = require('mercadopago');

const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Base de datos
const db = new sqlite3.Database('./ecomers.db', (err) => {
    if (err) return console.error('Error al conectar con la base de datos:', err.message);
    console.log('Conexión a la base de datos SQLite exitosa.');
});

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", 
      "default-src 'self'; " +
      "connect-src 'self' https://formsubmit.co; " +
      "form-action 'self' https://formsubmit.co; " +
      "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data:;");
    next();
  });

app.use(morgan('dev'));

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(session({
    secret: 'tu_secreto_seguro',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1 día
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(paymentRoutes);
app.use(express.static(path.resolve('public')));

// Mercado Pago
mercadopago.configure({
    access_token: 'TU ACCESS TOKEN DE MERCADO PAGO'
});

// Autenticación con Google
passport.use(new GoogleStrategy({
    clientID: 'TU CLIENT ID DE GOOGLE',
    clientSecret: 'TU CLIENT SECRET DE GOOGLE',
    callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    // Aquí podrías guardar el usuario en la base de datos si es necesario
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user); // Guarda todo el objeto del usuario
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Middleware de autenticación
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ error: 'Usuario no autenticado' });
}

// === RUTAS DE AUTENTICACIÓN ===
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


app.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.session.destroy(() => {
            // Redirigir al logout de Google y luego regresar a tu sitio
            const logoutGoogle = 'https://accounts.google.com/Logout';
            const redirectURL = 'http://localhost:3000'; // Cambia si usas dominio en producción
            res.redirect(`${logoutGoogle}?continue=https://appengine.google.com/_ah/logout?continue=${redirectURL}`);
        });
    });
});


// === RUTAS ===
app.get('/api/success', isAuthenticated, (req, res) => {
    res.json({
        message: 'Inicio de sesión con Google exitoso',
        user: req.user.displayName,
    });
});

app.get('/api/usuario', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            autenticado: true,
            nombre: req.user.displayName,
            email: req.user.emails?.[0]?.value,
        });
    } else {
        res.json({ autenticado: false });
    }
});

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`Bienvenido, ${req.user.displayName}`);
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

// Registro
app.post('/api/usuarios', (req, res) => {
    const { usuario, email, contraseña} = req.body;

    if (!usuario || !email || !contraseña) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const sqlBuscar = "SELECT * FROM usuarios WHERE nombre = ?";
    db.get(sqlBuscar, [usuario], (err, fila) => {
        if (err) return res.status(500).json({ error: 'Error al buscar usuario' });
        if (fila) return res.json({ exito: false, mensaje: 'Ese nombre de usuario ya está registrado' });

        bcrypt.hash(contraseña, saltRounds, (err, hash) => {
            if (err) return res.status(500).json({ error: 'Error al procesar la contraseña' });

            const stmt = db.prepare('INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)');
;
            stmt.run(usuario, email, hash, (err) => {
                if (err) return res.status(500).json({ error: 'Error al registrar el usuario' });
                res.json({ message: 'Usuario registrado correctamente' });
                stmt.finalize();
            });
        });
    });
});

// Login
app.post('/api/login', (req, res) => {
    const { usuario, contraseña } = req.body;

    if (!usuario || !contraseña) return res.status(400).json({ error: 'Faltan datos requeridos' });

    const sql = "SELECT * FROM usuarios WHERE email = ?";
    db.get(sql, [usuario], (err, fila) => {
        if (err) return res.status(500).json({ error: 'Error al buscar usuario' });
        if (!fila) return res.json({ exito: false, mensaje: 'Usuario no encontrado' });

        bcrypt.compare(contraseña, fila.contraseña, (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al verificar contraseña' });
            if (result) res.json({ exito: true });
            else res.json({ exito: false, mensaje: 'Contraseña incorrecta' });
        });
    });
});

// Productos
app.get('/api/productos', (req, res) => {
    db.all('SELECT * FROM productos', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// MercadoPago
app.post('/api/mercadopago/crear-preferencia', async (req, res) => {
    const { productos, total, usuario } = req.body;

    const items = productos.map(prod => ({
        title: prod.nombre || prod.modelo || 'Producto',
        quantity: prod.cantidad,
        unit_price: Number(prod.precio),
        currency_id: 'ARG'
    }));

    const preference = {
        items,
        payer: {
            email: usuario?.email || undefined
        },
        back_urls: {
            success: 'http://localhost:3000/success',
            failure: 'http://localhost:3000/failure',
            pending: 'http://localhost:3000/pending'
        },
        auto_return: 'approved'
    };

    try {
        const response = await mercadopago.preferences.create(preference);
        res.json({ id: response.body.id, init_point: response.body.init_point });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear preferencia', detalle: error.message });
    }
});

// Finalizar pedido
app.post('/api/finalizar-pedido', (req, res) => {
    const { id_usuario, id_metodo_pago, total, productos } = req.body;
    const fecha = new Date().toISOString();

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        db.run(`
            INSERT INTO pedidos (id_usuario, id_metodo_pago, fecha, total)
            VALUES (?, ?, ?, ?)
        `, [id_usuario, id_metodo_pago, fecha, total], function (err) {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: 'Error al crear el pedido', detalle: err.message });
            }

            const id_pedido = this.lastID;
            let errores = [];
            let completados = 0;

            productos.forEach((producto) => {
                const { id_reloj, cantidad, subtotal } = producto;

                db.get(`SELECT stock FROM relojes WHERE id_reloj = ?`, [id_reloj], (err, row) => {
                    if (err || !row || row.stock < cantidad) {
                        errores.push({ id_reloj, error: err?.message || 'Stock insuficiente' });
                        return checkFinal();
                    }

                    db.run(`INSERT INTO detalles_pedido (id_pedido, id_reloj, cantidad, subtotal) VALUES (?, ?, ?, ?)`,
                        [id_pedido, id_reloj, cantidad, subtotal]);

                    db.run(`UPDATE relojes SET stock = stock - ? WHERE id_reloj = ?`, [cantidad, id_reloj]);

                    db.run(`DELETE FROM carrito WHERE id_usuario = ? AND id_reloj = ?`, [id_usuario, id_reloj], checkFinal);
                });
            });

            function checkFinal() {
                completados++;
                if (completados === productos.length) {
                    if (errores.length > 0) {
                        db.run('ROLLBACK');
                        return res.status(400).json({ error: 'Fallo al procesar productos', detalles: errores });
                    }

                    db.run('COMMIT', (err) => {
                        if (err) return res.status(500).json({ error: 'Error al confirmar el pedido' });

                        db.all(`
                            SELECT r.marca, r.modelo, d.cantidad, d.subtotal
                            FROM detalles_pedido d
                            JOIN relojes r ON r.id_reloj = d.id_reloj
                            WHERE d.id_pedido = ?
                        `, [id_pedido], (err, detalles) => {
                            if (err) return res.status(500).json({ mensaje: 'Pedido creado, pero error en detalles' });
                            res.json({ mensaje: 'Pedido finalizado correctamente', id_pedido, detalles });
                        });
                    });
                }
            }
        });
    });
});

// Ver pedidos del usuario
app.get('/api/pedidos/:id_usuario', (req, res) => {
    const id_usuario = req.params.id_usuario;

    const query = `
        SELECT p.id_pedido, p.fecha, p.total, p.estado,
               r.marca, r.modelo, dp.cantidad, dp.subtotal
        FROM pedidos p
        JOIN detalles_pedido dp ON p.id_pedido = dp.id_pedido
        JOIN relojes r ON dp.id_reloj = r.id_reloj
        WHERE p.id_usuario = ?
        ORDER BY p.fecha DESC
    `;

    db.all(query, [id_usuario], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error al obtener pedidos' });

        const pedidos = [];
        const pedidoMap = {};

        rows.forEach(row => {
            if (!pedidoMap[row.id_pedido]) {
                pedidoMap[row.id_pedido] = {
                    id_pedido: row.id_pedido,
                    fecha: row.fecha,
                    total: row.total,
                    estado: row.estado,
                    productos: []
                };
                pedidos.push(pedidoMap[row.id_pedido]);
            }
            pedidoMap[row.id_pedido].productos.push({
                marca: row.marca,
                modelo: row.modelo,
                cantidad: row.cantidad,
                subtotal: row.subtotal
            });
        });

        res.json(pedidos);
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const correo = req.user.emails[0].value;

    const sqlBuscar = `SELECT id_usuario FROM usuarios WHERE email = ?`;
    db.get(sqlBuscar, [correo], (err, fila) => {
      if (err) {
        console.error("Error al buscar:", err.message);
        return res.send("Error al buscar el usuario");
      }

      if (fila) {
        return res.redirect(`/index.html?id_usuario=${fila.id_usuario}`);
      }

      const nombre = req.user.displayName || correo.split('@')[0];
      const telefono = "";
      const contraseña = "";
      const insert = `
        INSERT INTO usuarios (nombre, email, contraseña, telefono)
        VALUES (?, ?, ?, ?)
      `;

      db.run(insert, [nombre, correo, contraseña, telefono], function(err) {
        if (err) {
          console.error("Error al registrar usuario Google:", err.message);
          return res.send("No se pudo registrar con Google");
        }

        return res.redirect(`/login-exito.html?id_usuario=${this.lastID}`);
      });
    });
  }
);