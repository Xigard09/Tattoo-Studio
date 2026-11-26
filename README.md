# Tattoo Studio

## Descripción del proyecto

Tattoo Studio es nuestro proyecto formativo de Análisis y Desarrollo de Software (ADSO), orientado a la gestión de citas de un estudio de tatuajes. Buscamos facilitar la organización de clientes, tatuadores, servicios y reservas.

## Objetivo

Desarrollar una aplicación web que permita gestionar de manera organizada el proceso de programación de citas de un estudio de tatuajes.

## Tecnologías seleccionadas

| Tecnología | Función |
|---|---|
| PHP 8.5 y Laravel 12 | Backend y API REST |
| Laravel Sanctum | Autenticación mediante tokens |
| MySQL 8 | Base de datos relacional |
| HTML5, CSS3 y JavaScript | Interfaces y estilos |
| React 19 | Componentes de interfaz |
| React Router 7 | Navegación y rutas protegidas |
| Axios | Solicitudes HTTP |
| Vite 8 | Servidor de desarrollo y compilación |
| Node.js y npm | Entorno y dependencias del frontend |
| Git y GitHub | Control de versiones |

## Módulos y estado actual

- Clientes: registro, inicio y cierre de sesión y consulta del perfil.
- Tatuadores y servicios: catálogo dinámico consultado mediante la API.
- Citas: registro, consulta, edición y cancelación lógica de reservas propias.
- Disponibilidad: validación de fechas futuras y solapamiento de horarios considerando la duración del servicio.
- Seguridad: contraseñas protegidas mediante hashing, tokens de acceso, autorización de citas propias y rutas protegidas.
- Interfaces: diseño responsive y mensajes de éxito y error.

Quedan pendientes los módulos administrativos de tatuadores y servicios, la consulta anticipada de horarios disponibles y otras funcionalidades previstas, como los recordatorios. La disponibilidad actualmente se verifica al guardar la cita.

## Arquitectura

Utilizamos Laravel con una organización basada en MVC para la lógica de negocio y el acceso a datos. React constituye la capa de presentación independiente. La comunicación se realiza mediante una API REST con mensajes JSON.

```text
React + Axios --> API REST Laravel + Sanctum --> MySQL
```

En desarrollo, Vite redirige las solicitudes `/api` a `http://127.0.0.1:8000` mediante el proxy definido en `frontend/vite.config.js`.

## Estructura del repositorio

```text
Tattoo-Studio/
├── .postman/
├── backend/                 # Laravel
├── frontend/                # React y Vite
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── styles/
│       └── App.jsx
├── postman/                 # Colección de pruebas
├── API.md                   # Documentación de la API
├── index.html               # Prototipo anterior
├── nosotros.html            # Prototipo anterior
└── README.md
```

## Base de datos

Utilizamos MySQL y la base de datos `tattoo_book`. Las entidades principales son cliente, tatuador, servicio y cita. Sanctum utiliza además la tabla `personal_access_tokens`.

## Estándares de codificación

- Variables y métodos: camelCase.
- Clases y componentes React: PascalCase.
- PHP: PSR-12.
- Organización según la estructura de Laravel y separación de componentes, páginas, servicios y estilos en React.
- Comentarios descriptivos cuando sean necesarios.

## Herramientas y requisitos

Visual Studio Code, Git, PHP 8.5 con las extensiones requeridas por Laravel (incluida PDO MySQL), Composer, MySQL 8, MySQL Workbench, Node.js compatible con Vite 8 (se recomienda Node.js 22.12 o superior de una rama LTS compatible), npm y Postman. XAMPP puede utilizarse como herramienta auxiliar si sus versiones son compatibles.

## Instalación en otro computador (Windows)

### 1. Descargar el repositorio

```powershell
git clone https://github.com/Xigard09/Tattoo-Studio.git
cd Tattoo-Studio
```

Si ya existe una copia local, revisar `git status` antes de cambiar de rama o actualizarla con `git pull`.

### 2. Configurar el backend

```powershell
cd backend
composer install
```

En una instalación nueva, crear el archivo de entorno y generar la clave:

```powershell
Copy-Item .env.example .env
php artisan key:generate
```

Si ya existe un `.env` configurado, conservarlo. Ajustar la conexión según las credenciales locales:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tattoo_book
DB_USERNAME=root
DB_PASSWORD=
```

Los valores de usuario y contraseña son ejemplos y deben adaptarse al equipo.

### 3. Restaurar la base de datos

Iniciar MySQL y restaurar una copia SQL del esquema del proyecto mediante MySQL Workbench, incluyendo las tablas, relaciones y datos de catálogo necesarios. La copia debe ser compatible con el backend actual. Si no se dispone de ella, solicitarla al equipo antes de continuar. No utilizar datos personales reales para las pruebas.

Comprobar las migraciones con `php artisan migrate:status`. Si faltan migraciones de autenticación, revisar su contenido y el esquema restaurado antes de ejecutar `php artisan migrate`. No usar `migrate:fresh`, pues elimina las tablas existentes.

### 4. Iniciar Laravel

Desde `backend/`:

```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

Verificar el servicio en http://127.0.0.1:8000/api/estado. Mantener abierta esta terminal.

### 5. Instalar e iniciar React

Abrir otra terminal desde la raíz del repositorio:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Si existe un `package-lock.json` actualizado, se puede usar `npm.cmd ci` en lugar de `npm.cmd install` para reproducir las dependencias bloqueadas.

Abrir http://localhost:5173 (o la dirección indicada por Vite). Mantener MySQL y Laravel activos. Usamos `npm.cmd` en Windows para evitar problemas con las políticas de ejecución de scripts de PowerShell.

### 6. Compilar el frontend

```powershell
npm.cmd run build
```

La compilación genera `frontend/dist/`. Esta carpeta no necesita versionarse. El despliegue en producción requiere configurar el servidor para servir React, resolver sus rutas y conectar `/api` con Laravel; el proxy de desarrollo no sustituye esa configuración.

## Pruebas funcionales

Durante el desarrollo comprobamos el registro, consulta, edición y cancelación de citas, los conflictos por horarios duplicados y superpuestos, y la persistencia tras cerrar e iniciar sesión. También verificamos la redirección al login desde las cuatro rutas privadas y revisamos visualmente las ocho interfaces en una pantalla móvil emulada de 400 × 861 píxeles. La compilación de Vite se completó sin errores.

Para repetir las pruebas, registrar un cliente de prueba, seleccionar un tatuador y servicio activos y utilizar fechas futuras. Comprobar que una reserva superpuesta sea rechazada y que una cita cancelada permanezca en el historial sin acciones de edición o cancelación.

## Pruebas de la API

Utilizamos Postman. La colección se encuentra en `postman/`.

1. Abrir Tattoo Studio API y seleccionar Tattoo Studio Local.
2. Comprobar `base_url` y configurar localmente la contraseña de prueba.
3. Iniciar sesión y utilizar el token obtenido en `token`.
4. Probar las citas con un identificador propio en `id_cita`.
5. Cerrar sesión y limpiar las credenciales antes de guardar cambios en Git.

Consultar [API.md](API.md) para la documentación técnica de la API.

## Control de versiones

Repositorio: https://github.com/Xigard09/Tattoo-Studio

- `main`: rama principal.
- `feature/api-rest`: desarrollo de la API REST.
- `feature/frontend-react`: desarrollo e integración de React.

| Commit | Implementación |
|---|---|
| `86aed46` | Configuración inicial de React e integración con Axios |
| `d8db322` | Endpoints públicos del catálogo |
| `e385a64` | Migración del prototipo, navegación y catálogo dinámico |
| `22ad385` | Autenticación, registro, perfil y rutas protegidas |
| `02207bd` | Gestión de citas en React |

Trabajamos con commits descriptivos y sincronizamos mediante `push` y `pull`. No subir `.env`, contraseñas, tokens, copias de bases de datos con información sensible, `node_modules`, `vendor` ni archivos generados de compilación.
