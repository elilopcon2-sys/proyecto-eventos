# Plataforma de Eventos e Inscripciones

## Descripción

API REST desarrollada con Node.js y Express para la gestión de eventos e inscripciones de usuarios.

El proyecto permitirá administrar eventos, gestionar usuarios, controlar inscripciones y manejar la disponibilidad de cupos.

La aplicación está organizada mediante una arquitectura por capas, facilitando su mantenimiento, escalabilidad y desarrollo de nuevas funcionalidades.

## Tecnologías utilizadas

- **Node.js:** entorno de ejecución de JavaScript en el servidor.
- **Express.js:** framework para desarrollar nuestra API REST.
- **JavaScript (ESM):** lenguaje de programación con módulos import/export.
- **dotenv:** gestión de variables de entorno.
- **Git:** control de versiones del proyecto.

## Instalación

### Requisitos previos

- Tener instalado Node.js y npm.
- Tener Git instalado.

### Pasos para instalar

1. Clonar el repositorio:

```bash
git clone https://github.com/elilopcon2-sys/proyecto-eventos.git
```

2. Ingresar a la carpeta del proyecto:

```bash
cd proyecto-eventos
```

3. Instalar las dependencias:

```bash
npm install
```

## Configuración de variables de entorno

Para configurar las variables de entorno, crea una copia del archivo `.env.example` con el nombre `.env`.

En Git Bash puedes ejecutar:

```bash
cp .env.example .env
```

Las variables utilizadas son:

| Variable | Descripción |
|---|---|
| PORT | Puerto donde se ejecuta el servidor |
| NODE_ENV | Entorno de ejecución |
| MONGO_URL | URL de conexión a MongoDB |
| JWT_SECRET | Clave secreta para autenticación JWT |

Por ahora, MONGO_URL y JWT_SECRET quedan sin configurar, ya que su implementación corresponde a futuras entregas.

## Ejecución del proyecto

Para iniciar el servidor, ejecuta:

```bash
npm start
```

El servidor se iniciará en el puerto configurado en el archivo `.env`.

Por defecto, utilizamos el puerto 8080.

Una vez iniciado, puedes comprobar su funcionamiento en:

http://localhost:8080/api/health

## Estructura del proyecto

```text
proyecto-eventos/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── dao/
│   ├── models/
│   ├── middlewares/
│   └── utils/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Rutas disponibles

La API cuenta actualmente con los siguientes endpoints:

| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/health | Verifica que el servidor esté activo |
| GET | /api/events | Retorna la lista de eventos (actualmente vacía) |
| GET | /api/sessions | Verifica que el módulo de sesiones esté preparado |

### Ejemplo de respuesta de GET /api/events

```json
{
  "status": "success",
  "payload": []
}
```

Las funcionalidades de autenticación, gestión de eventos e inscripciones se implementarán en próximas entregas.