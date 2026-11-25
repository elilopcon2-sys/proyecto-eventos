
# Plataforma de Eventos e Inscripciones

## Descripción

API REST desarrollada con Node.js, Express y MongoDB Atlas para la gestión de eventos e inscripciones de usuarios.

El proyecto utiliza una arquitectura por capas que separa rutas, controladores, servicios, repositorios, DAO y modelos.

En la Pre-entrega 3 se implementó un sistema de autenticación mediante JSON Web Token (JWT), almacenado en una cookie HTTP Only.

El sistema permite:

- Registrar usuarios.
- Validar credenciales.
- Iniciar sesión.
- Generar tokens JWT.
- Consultar el usuario autenticado.
- Proteger rutas mediante middleware.
- Cerrar sesión eliminando la cookie.

## Tecnologías utilizadas

- Node.js
- Express.js
- JavaScript con ESM
- MongoDB Atlas
- Mongoose
- bcrypt
- jsonwebtoken
- cookie-parser
- dotenv
- Git y GitHub
- Postman para pruebas de API

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/elilopcon2-sys/proyecto-eventos.git
```

### 2. Ingresar al proyecto

```bash
cd proyecto-eventos
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar variables de entorno

Crear un archivo `.env` a partir de `.env.example`:

```bash
cp .env.example .env
```

Completar las variables con los valores correspondientes.

## Variables de entorno

| Variable | Descripción |
|---|---|
| `PORT` | Puerto de ejecución del servidor |
| `NODE_ENV` | Entorno de ejecución |
| `MONGO_URL` | Cadena de conexión a MongoDB Atlas |
| `JWT_SECRET` | Clave secreta para firmar y verificar tokens |
| `JWT_EXPIRES_IN` | Tiempo de expiración del JWT |

Ejemplo de `.env.example`:

```dotenv
PORT=8080
NODE_ENV=development
MONGO_URL=tu_cadena_de_conexion_de_mongodb
JWT_SECRET=
JWT_EXPIRES_IN=1h
```

La variable `JWT_SECRET` debe configurarse con una clave secreta segura en el archivo `.env`.

**Importante:** el archivo `.env` contiene información privada y no debe publicarse en GitHub.

## Ejecución

Para iniciar el servidor:

```bash
npm start
```

La aplicación utiliza el puerto configurado en `.env`.

Por defecto:

```text
http://localhost:8080
```

El servidor establece la conexión con MongoDB Atlas mediante Mongoose.

## Estructura del proyecto

```text
proyecto-eventos/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── health.controller.js
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

## Arquitectura

El proyecto utiliza una arquitectura por capas.

| Capa | Responsabilidad |
|---|---|
| Routes | Define los endpoints |
| Controllers | Gestiona peticiones y respuestas HTTP |
| Services | Contiene la lógica de negocio |
| Repositories | Comunica servicios con DAO |
| DAO | Ejecuta consultas a MongoDB |
| Models | Define los esquemas de Mongoose |
| Middlewares | Verifica condiciones antes de acceder a rutas |
| Utils | Contiene funciones reutilizables |

### Flujo de consulta a MongoDB

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
| GET | `/api/events` | Consultar los eventos |
| GET | `/api/sessions` | Verificar el módulo de sesiones |
| POST | `/api/sessions/register` | Registrar un usuario |
| POST | `/api/sessions/login` | Iniciar sesión |
| GET | `/api/sessions/current` | Consultar el usuario autenticado |
| POST | `/api/sessions/logout` | Cerrar sesión |

---

## 1. Registro de usuarios

### Endpoint

```http
POST /api/sessions/register
```

### Descripción

Registra un nuevo usuario en MongoDB.

El sistema:

1. Valida los campos obligatorios.
2. Verifica el formato del email.
3. Normaliza el email.
4. Comprueba que el usuario no exista.
5. Genera el hash de la contraseña con bcrypt.
6. Almacena el usuario en MongoDB.
7. Devuelve los datos del usuario sin incluir su contraseña.

El rol inicial del usuario será `user`.

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

### Response 400 - Campos obligatorios faltantes

```json
{
  "status": "error",
  "message": "Faltan campos obligatorios"
}
```

### Response 400 - Email inválido

```json
{
  "status": "error",
  "message": "El formato del email es inválido"
}
```

### Response 409 - Email duplicado

```json
{
  "status": "error",
  "message": "El email ya está registrado"
}
```

Las contraseñas se almacenan utilizando bcrypt y nunca se devuelven en las respuestas.

---

## 2. Login de usuarios

### Endpoint

```http
POST /api/sessions/login
```

### Descripción

Permite que un usuario registrado inicie sesión mediante email y contraseña.

El sistema:

1. Valida la presencia de las credenciales.
2. Normaliza el email.
3. Busca al usuario en MongoDB.
4. Compara la contraseña utilizando bcrypt.
5. Genera un JWT firmado con `JWT_SECRET`.
6. Almacena el JWT en una cookie HTTP Only llamada `currentUser`.

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

El JWT no se devuelve en el cuerpo JSON. Se envía mediante una cookie.

### Configuración de la cookie

| Propiedad | Valor |
|---|---|
| Nombre | `currentUser` |
| httpOnly | `true` |
| sameSite | `lax` |
| secure | `true` únicamente en producción |
| maxAge | `3600000` milisegundos |

### Payload del JWT

```json
{
  "id": "665f2a123456789012345678",
  "email": "ana@mail.com",
  "role": "user"
}
```

El token contiene únicamente la información necesaria para identificar al usuario, además de los campos temporales generados por la librería JWT.

La expiración se configura mediante `JWT_EXPIRES_IN`.

### Response 401 - Credenciales inválidas

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

El middleware obtiene el JWT de la cookie `currentUser`, verifica su firma y comprueba su expiración.

Si el token es válido, almacena su contenido en `req.user` y permite continuar hacia el controlador.

### Request

```http
GET /api/sessions/current
```

No requiere un body JSON.

La petición debe incluir la cookie de autenticación:

```http
Cookie: currentUser=<token_jwt>
```

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

El servidor responde con HTTP 401 cuando:

- La cookie no existe.
- El JWT es inválido.
- El JWT ha sido manipulado.
- El JWT está expirado.

La respuesta nunca incluye la contraseña del usuario.

---

## 4. Logout

### Endpoint

```http
POST /api/sessions/logout
```

### Descripción

Permite cerrar la sesión eliminando la cookie de autenticación `currentUser`.

### Request

```http
POST /api/sessions/logout
```

No requiere un body JSON.

### Response 200 - Sesión cerrada

```json
{
  "status": "success",
  "message": "Sesión cerrada"
}
```

Después del logout, el cliente ya no tendrá la cookie de autenticación.

Si intenta acceder a `/api/sessions/current` sin iniciar sesión nuevamente, recibirá HTTP 401.

---

## 5. Estado del módulo de sesiones

### Endpoint

```http
GET /api/sessions
```

### Descripción

Verifica que el módulo de sesiones esté disponible.

### Request

No requiere un body JSON.

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

Permite verificar que el servidor Express está activo.

### Request

No requiere un body JSON.

### Response 200 - Servidor activo

```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

---


## 7. Consulta de eventos

### Endpoint

GET /api/events

### Descripción

Endpoint inicial del módulo de eventos.

Actualmente devuelve un arreglo vacío como respuesta de prueba. La consulta de eventos desde MongoDB queda pendiente para futuras implementaciones.

### Request

No requiere un body JSON.

### Response 200 - Consulta exitosa

```json
{
  "status": "success",
  "payload": []
}
```

## Modelo User

El modelo de usuario está definido mediante Mongoose y contiene:

| Campo | Tipo | Descripción |
|---|---|---|
| first_name | String | Nombre del usuario |
| last_name | String | Apellido del usuario |
| email | String | Correo electrónico único |
| password | String | Hash de la contraseña |
| role | String | Rol del usuario |

Los roles permitidos son:

- `user`
- `organizer`
- `admin`

El rol predeterminado es `user`.

El esquema utiliza `timestamps: true` para almacenar las fechas de creación y actualización.

## Seguridad

El proyecto implementa:

- Validación de campos obligatorios.
- Normalización de emails.
- Control de emails duplicados.
- Hash de contraseñas mediante bcrypt.
- Comparación segura de contraseñas.
- Mensajes genéricos para credenciales inválidas.
- Generación de JWT con payload mínimo.
- Firma JWT utilizando variables de entorno.
- Expiración configurable del JWT.
- Autenticación mediante cookies HTTP Only.
- Configuración `sameSite: lax`.
- Cookies `secure` en producción.
- Middleware de protección de rutas.
- Respuestas HTTP 401 ante autenticación inválida.
- Eliminación de la cookie durante el logout.
- Exclusión de archivos privados mediante `.gitignore`.

El archivo `.gitignore` contiene:

```gitignore
node_modules/
.env
```

## Pruebas realizadas en Postman

Durante el desarrollo se realizaron las siguientes pruebas:

| Prueba | Resultado esperado | Estado |
|---|---|---|
| Registro exitoso | 201 Created | Correcto |
| Login exitoso | 200 OK | Correcto |
| Cookie `currentUser` | Cookie generada | Correcto |
| `/current` con cookie válida | 200 OK | Correcto |
| `/current` sin cookie | 401 Unauthorized | Correcto |
| Logout | 200 OK | Correcto |
| `/current` después del logout | 401 Unauthorized | Correcto |
| Login con contraseña incorrecta | 401 Unauthorized | Correcto |
| Login con email inexistente | 401 Unauthorized | Correcto |
| Login sin contraseña | 401 Unauthorized | Correcto |
| `/current` con JWT inválido | 401 Unauthorized | Correcto |
| `/current` con JWT expirado | 401 Unauthorized | Correcto |

Para verificar la expiración del JWT se configuró temporalmente `JWT_EXPIRES_IN=5s` y se comprobó que el middleware rechazara el token expirado.

Posteriormente se restauró la configuración a `JWT_EXPIRES_IN=1h`.

## Flujo completo de autenticación

```text
1. REGISTRO

POST /api/sessions/register
          |
          v
Validar campos
          |
          v
Consultar MongoDB
          |
          v
Verificar email duplicado
          |
          v
Generar hash con bcrypt
          |
          v
Guardar usuario en MongoDB


2. LOGIN

POST /api/sessions/login
          |
          v
Validar credenciales
          |
          v
Buscar usuario en MongoDB
          |
          v
Comparar contraseña con bcrypt
          |
          v
Generar JWT
          |
          v
Guardar cookie currentUser


3. RUTA PROTEGIDA

GET /api/sessions/current
          |
          v
Middleware auth
          |
          v
Leer cookie currentUser
          |
          v
Verificar JWT
          |
          v
Guardar payload en req.user
          |
          v
Devolver id, email y role


4. LOGOUT

POST /api/sessions/logout
          |
          v
Eliminar cookie currentUser
          |
          v
Confirmar cierre de sesión
          |
          v
/current sin cookie devuelve 401
```

## Repositorio GitHub

Código fuente:

https://github.com/elilopcon2-sys/proyecto-eventos

## Estado del proyecto

**Pre-entrega 3 — Autenticación con JWT y cookies.**

Funcionalidades implementadas y probadas:

- Servidor Express.
- Conexión a MongoDB Atlas mediante Mongoose.
- Modelo User.
- Registro seguro de usuarios.
- Validación y normalización de emails.
- Hash de contraseñas con bcrypt.
- Login.
- Comparación segura de contraseñas.
- Generación y verificación de JWT.
- Cookie de autenticación HTTP Only.
- Middleware de autenticación.
- Ruta protegida `/api/sessions/current`.
- Logout.
- Variables de entorno.
- Archivo `.env.example`.
- Documentación README.
- Pruebas en Postman.
- Repositorio GitHub.
