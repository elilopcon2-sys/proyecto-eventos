
# Plataforma de Eventos e Inscripciones

## Descripción

API REST desarrollada con Node.js, Express y MongoDB Atlas para la gestión de eventos e inscripciones de usuarios.

La aplicación utiliza una arquitectura por capas que separa rutas, controladores, servicios, repositorios, DAO y modelos.

En esta tercera pre-entrega se implementa un sistema de autenticación mediante JSON Web Token (JWT), almacenado en una cookie HTTP Only, que permite registrar usuarios, iniciar sesión, consultar el usuario autenticado y cerrar sesión de forma segura.

## Tecnologías utilizadas

- Node.js
- Express.js
- JavaScript con ESM
- MongoDB Atlas y Mongoose
- bcrypt para el hash de contraseñas
- JSON Web Token (JWT) para la autenticación
- cookie-parser para gestionar cookies
- dotenv para variables de entorno
- Git y GitHub
- Postman para las pruebas de endpoints

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/elilopcon2-sys/proyecto-eventos.git
```

### 2. Ingresar a la carpeta

```bash
cd proyecto-eventos
```

### 3. Instalar las dependencias

```bash
npm install
```

### 4. Configurar las variables de entorno

Crear el archivo `.env` a partir de la plantilla:

```bash
cp .env.example .env
```

Configurar las variables correspondientes.

## Variables de entorno

El proyecto utiliza las siguientes variables:

| Variable | Descripción |
|---|---|
| `PORT` | Puerto donde se ejecuta el servidor |
| `NODE_ENV` | Entorno de ejecución: development o production |
| `MONGO_URL` | Cadena de conexión a MongoDB Atlas |
| `JWT_SECRET` | Clave secreta para firmar y verificar JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token |

Ejemplo de `.env.example`:

```dotenv
PORT=8080
NODE_ENV=development
MONGO_URL=tu_cadena_de_conexion_de_mongodb
JWT_SECRET=
JWT_EXPIRES_IN=1h
```

La variable `JWT_SECRET` debe contener una clave secreta segura en el archivo `.env` real.

**Importante:** nunca subir `.env`, credenciales privadas ni contraseñas al repositorio.

## Ejecución

Para iniciar el servidor:

```bash
npm start
```

El servidor se inicia en el puerto configurado en `.env`.

Por defecto:

```text
http://localhost:8080
```

Para comprobar el funcionamiento del servidor:

```http
GET http://localhost:8080/api/health
```

## Estructura del proyecto

```text
proyecto-eventos/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── sessions.controller.js
│   ├── dao/
│   │   └── users.dao.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   ├── repositories/
│   │   └── users.repository.js
│   ├── routes/
│   │   ├── health.router.js
│   │   ├── events.router.js
│   │   └── sessions.router.js
│   ├── services/
│   │   └── sessions.service.js
│   └── utils/
│       ├── hash.js
│       └── jwt.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Arquitectura del proyecto

La aplicación utiliza una arquitectura por capas.

- **Routes:** definen los endpoints de la API.
- **Controllers:** reciben las peticiones HTTP y devuelven respuestas.
- **Services:** contienen la lógica de negocio.
- **Repositories:** comunican los servicios con los DAO.
- **DAO:** realizan las consultas a MongoDB mediante Mongoose.
- **Models:** definen la estructura de los documentos.
- **Middlewares:** verifican condiciones antes de acceder a rutas protegidas.
- **Utils:** contienen funciones reutilizables para bcrypt y JWT.

El flujo de autenticación utiliza:

```text
Cliente
   |
   v
Routes
   |
   v
Controllers
   |
   v
Services
   |
   v
Repositories
   |
   v
DAO
   |
   v
MongoDB Atlas
```

## Rutas disponibles

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Verificar el estado del servidor |
| GET | `/api/events` | Consultar la lista de eventos |
| GET | `/api/sessions` | Verificar el módulo de sesiones |
| POST | `/api/sessions/register` | Registrar un usuario |
| POST | `/api/sessions/login` | Iniciar sesión y generar JWT |
| GET | `/api/sessions/current` | Consultar el usuario autenticado |
| POST | `/api/sessions/logout` | Cerrar sesión y eliminar la cookie |

---

## 1. Registro de usuarios

### Endpoint

```http
POST /api/sessions/register
```

### Descripción

Permite registrar nuevos usuarios mediante los campos obligatorios:

- `first_name`
- `last_name`
- `email`
- `password`

El sistema valida los campos, normaliza el email, comprueba que no exista previamente y almacena la contraseña utilizando bcrypt.

El rol inicial será `user`.

### Request

```json
{
  "first_name": "Ana",
  "last_name": "Perez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```

### Response 201 - Registro exitoso

```json
{
  "status": "success",
  "payload": {
    "id": "665f2a123456789012345678",
    "first_name": "Ana",
    "last_name": "Perez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

### Response 400 - Campos inválidos

```json
{
  "status": "error",
  "message": "Faltan campos obligatorios"
}
```

### Response 409 - Email duplicado

```json
{
  "status": "error",
  "message": "El email ya está registrado"
}
```

La contraseña nunca se devuelve en las respuestas.

---

## 2. Login de usuarios

### Endpoint

```http
POST /api/sessions/login
```

### Descripción

Permite autenticar un usuario mediante email y contraseña.

El sistema realiza las siguientes operaciones:

1. Valida la presencia de email y contraseña.
2. Normaliza el email.
3. Busca al usuario en MongoDB.
4. Compara la contraseña ingresada con el hash almacenado mediante bcrypt.
5. Genera un JWT si las credenciales son correctas.
6. Guarda el JWT en una cookie HTTP Only llamada `currentUser`.

### Request

```json
{
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

### Response 200 - Login exitoso

```json
{
  "status": "success",
  "message": "Login correcto"
}
```

La respuesta también establece la cookie `currentUser`.

### Configuración de la cookie

| Propiedad | Valor |
|---|---|
| Nombre | `currentUser` |
| httpOnly | `true` |
| sameSite | `lax` |
| secure | `true` solo en producción |
| maxAge | `3600000` milisegundos |

La cookie almacena el JWT generado durante el login.

### Payload del JWT

```json
{
  "id": "665f2a123456789012345678",
  "email": "ana@mail.com",
  "role": "user"
}
```

El JWT incluye además los campos de control temporal generados por la librería, como `iat` y `exp`.

La firma utiliza la variable de entorno `JWT_SECRET`.

La expiración se configura con `JWT_EXPIRES_IN`.

### Response 401 - Credenciales incorrectas

```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```

El sistema devuelve el mismo mensaje cuando:

- El email no existe.
- La contraseña es incorrecta.
- Faltan las credenciales obligatorias.

Esto evita revelar información sobre los usuarios registrados.

---

## 3. Consultar usuario autenticado

### Endpoint

```http
GET /api/sessions/current
```

### Descripción

Ruta protegida mediante el middleware `auth`.

El middleware obtiene el JWT almacenado en la cookie `currentUser`, verifica su firma y comprueba su expiración.

Cuando el token es válido, guarda el payload en `req.user`.

### Request

```http
GET /api/sessions/current
```

No requiere un body JSON.

El cliente debe enviar la cookie `currentUser` obtenida durante el login.

### Response 200 - Usuario autenticado

```json
{
  "status": "success",
  "payload": {
    "id": "665f2a123456789012345678",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

### Response 401 - No autenticado

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

Esta respuesta ocurre cuando:

- No existe la cookie.
- El token es inválido.
- El token fue manipulado.
- El token expiró.

La contraseña no se incluye en la respuesta.

---

## 4. Logout

### Endpoint

```http
POST /api/sessions/logout
```

### Descripción

Permite cerrar la sesión eliminando la cookie `currentUser`.

### Request

```http
POST /api/sessions/logout
```

No requiere body JSON.

### Response 200 - Sesión cerrada

```json
{
  "status": "success",
  "message": "Sesión cerrada"
}
```

Después del logout, el usuario deberá iniciar sesión nuevamente para obtener una cookie válida.

Si intenta acceder a `/api/sessions/current` sin autenticarse, recibirá:

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

---

## 5. Estado del módulo de sesiones

### Endpoint

```http
GET /api/sessions
```

### Request

No requiere body JSON.

### Response 200

```json
{
  "status": "success",
  "message": "Módulo de sesiones preparado"
}
```

---

## 6. Estado del servidor

### Endpoint

```http
GET /api/health
```

### Descripción

Permite comprobar que el servidor se encuentra disponible.

### Request

No requiere body JSON.

### Response

El endpoint devuelve información sobre el estado del servidor. La estructura JSON exacta depende de `health.router.js` y debe verificarse antes de entregar.

---

## 7. Consulta de eventos

### Endpoint

```http
GET /api/events
```

### Descripción

Permite consultar la lista de eventos disponibles.

### Request

No requiere body JSON.

### Response

El endpoint devuelve la respuesta configurada en `events.router.js`. Su estructura exacta debe verificarse antes de entregar.

---

## Seguridad de la autenticación

Se implementaron las siguientes medidas de seguridad:

- Contraseñas almacenadas mediante bcrypt.
- Comparación segura de contraseñas.
- Normalización de emails.
- Validación de campos obligatorios.
- Control de emails duplicados.
- Mensajes genéricos para credenciales inválidas.
- Generación de JWT con información mínima del usuario.
- Firma de JWT mediante una clave almacenada en variables de entorno.
- Configuración de expiración del JWT.
- Uso de cookies HTTP Only.
- Configuración `sameSite: lax`.
- Cookies `secure` en producción.
- Middleware de protección de rutas.
- Respuesta HTTP 401 para usuarios no autenticados.
- Eliminación de cookies durante el logout.
- Exclusión de `.env` y `node_modules` mediante `.gitignore`.

## Pruebas realizadas en Postman

Se verificaron los siguientes casos:

| Prueba | Resultado esperado | Estado |
|---|---|---|
| Registro exitoso | 201 Created | Correcto |
| Login exitoso | 200 OK | Correcto |
| Generación de cookie JWT | Cookie `currentUser` | Correcto |
| `/current` con cookie válida | 200 OK | Correcto |
| `/current` sin cookie | 401 Unauthorized | Correcto |
| Logout | 200 OK | Correcto |
| `/current` después del logout | 401 Unauthorized | Correcto |
| Login con contraseña incorrecta | 401 Unauthorized | Correcto |
| Login con email inexistente | 401 Unauthorized | Correcto |
| Login sin contraseña | 401 Unauthorized | Correcto |
| `/current` con token inválido | 401 Unauthorized | Correcto |

## Flujo completo de autenticación

```text
1. Registro de usuario
   POST /api/sessions/register
          |
          v
   Validación de campos
          |
          v
   Hash de contraseña
          |
          v
   Usuario guardado en MongoDB

2. Inicio de sesión
   POST /api/sessions/login
          |
          v
   Validación de credenciales
          |
          v
   Comparación con bcrypt
          |
          v
   Generación del JWT
          |
          v
   Cookie currentUser HTTP Only

3. Consulta del usuario
   GET /api/sessions/current
          |
          v
   Middleware auth
          |
          v
   Verificación del JWT
          |
          v
   Datos del usuario autenticado

4. Cierre de sesión
   POST /api/sessions/logout
          |
          v
   Eliminación de currentUser
          |
          v
   Acceso a /current rechazado
   HTTP 401
```

## Repositorio

Código fuente disponible en:

https://github.com/elilopcon2-sys/proyecto-eventos

## Estado del proyecto

Pre-entrega 3 - Autenticación con JWT y cookies.

Funcionalidades implementadas:

- Registro seguro de usuarios.
- Validación de credenciales.
- Login mediante JWT.
- Almacenamiento de JWT en cookie HTTP Only.
- Middleware de autenticación.
- Consulta del usuario autenticado.
- Logout.
- Configuración mediante variables de entorno.
- Arquitectura por capas.
- Pruebas funcionales en Postman.
