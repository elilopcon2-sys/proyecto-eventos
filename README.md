# Plataforma de Eventos e Inscripciones

## Descripción

API REST desarrollada con Node.js y Express para la gestión de eventos e inscripciones de usuarios.

La aplicación usa una arquitectura por capas para separar rutas, controllers, servicios, repositorios, DAO y modelos.

## Tecnologías utilizadas

- Node.js
- Express.js
- JavaScript con ESM
- MongoDB y Mongoose
- bcrypt
- dotenv
- Git

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/elilopcon2-sys/proyecto-eventos.git
```

2. Ingresa a la carpeta:

```bash
cd proyecto-eventos
```

3. Instala las dependencias:

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` a partir de la plantilla:

```bash
cp .env.example .env
```

Configura las siguientes variables:

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor |
| `NODE_ENV` | Entorno de ejecución |
| `MONGO_URL` | Cadena de conexión a MongoDB Atlas |
| `JWT_SECRET` | Clave secreta para futuras funcionalidades de autenticación |

`MONGO_URL` es obligatoria para iniciar el servidor. Nunca subas `.env`, credenciales ni contraseñas al repositorio.

## Ejecución

Para iniciar el servidor:

```bash
npm start
```

El servidor se inicia en el puerto configurado en `.env`. Por defecto utiliza el puerto `8080`.

Puedes comprobarlo en:

```text
http://localhost:8080/api/health
```

## Estructura del proyecto

```text
proyecto-eventos/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── database.js
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── dao/
│   ├── models/
│   └── utils/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Rutas disponibles

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Verifica que el servidor esté activo |
| GET | `/api/events` | Retorna la lista de eventos |
| GET | `/api/sessions` | Verifica el módulo de sesiones |
| POST | `/api/sessions/register` | Registra un usuario de forma segura |

## Registro seguro de usuarios

### Endpoint

```text
POST /api/sessions/register
```

### Campos requeridos

- `first_name`
- `last_name`
- `email`
- `password` con mínimo 8 caracteres

El email se normaliza antes de guardarse: se eliminan espacios y se convierte a minúsculas.

El rol inicial siempre será `user`. Cualquier valor de `role` enviado desde el body se ignora para evitar que un usuario se registre como administrador.

### Prueba en Postman

Envía una petición `POST` a:

```text
http://localhost:8080/api/sessions/register
```

Con este body JSON:

```json
{
  "first_name": "Ana",
  "last_name": "Perez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```

### Respuesta exitosa

```json
{
  "status": "success",
  "payload": {
    "id": "identificador-del-usuario",
    "first_name": "Ana",
    "last_name": "Perez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

La contraseña nunca se devuelve en la respuesta y se guarda hasheada con bcrypt.

### Casos validados

- Registro exitoso.
- Campos obligatorios faltantes.
- Email con formato inválido.
- Email duplicado.
- Contraseña hasheada en MongoDB.
- Respuesta sin el campo `password`.
- Rol público forzado a `user`.