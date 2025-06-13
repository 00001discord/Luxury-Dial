
-- Eliminar tablas si existen (orden correcto por dependencias)
DROP TABLE IF EXISTS comentarios;
DROP TABLE IF EXISTS carrito;
DROP TABLE IF EXISTS detalles_pedido;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS metodos_pago;
DROP TABLE IF EXISTS relojes;
DROP TABLE IF EXISTS usuarios;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    contraseña TEXT NOT NULL,
    direccion TEXT,
    telefono TEXT,
    rol TEXT DEFAULT 'cliente'
);

-- Tabla de relojes (productos)
CREATE TABLE relojes (
    id_reloj INTEGER PRIMARY KEY AUTOINCREMENT,
    marca TEXT NOT NULL,
    modelo TEXT NOT NULL,
    descripcion TEXT,
    precio REAL NOT NULL,
    stock INTEGER NOT NULL,
    imagen_url TEXT
);

-- Tabla de métodos de pago
CREATE TABLE metodos_pago (
    id_metodo_pago INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL CHECK(tipo IN ( 'mercado_pago')),
    descripcion TEXT
);

-- Tabla de pedidos
CREATE TABLE pedidos (
    id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    id_metodo_pago INTEGER NOT NULL,
    fecha TEXT NOT NULL,
    total REAL NOT NULL,
    estado TEXT DEFAULT 'pendiente',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_metodo_pago) REFERENCES metodos_pago(id_metodo_pago)
);

-- Tabla de detalles de pedido
CREATE TABLE detalles_pedido (
    id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pedido INTEGER NOT NULL,
    id_reloj INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
    FOREIGN KEY (id_reloj) REFERENCES relojes(id_reloj)
);

-- Tabla de carrito (productos añadidos antes de comprar)
CREATE TABLE carrito (
    id_carrito INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    id_reloj INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    fecha_agregado TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_reloj) REFERENCES relojes(id_reloj)
);

-- Tabla de comentarios/valoraciones de relojes
CREATE TABLE comentarios (
    id_comentario INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    id_reloj INTEGER NOT NULL,
    comentario TEXT,
    valoracion INTEGER CHECK(valoracion >= 1 AND valoracion <= 5),
    fecha TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_reloj) REFERENCES relojes(id_reloj)
);
