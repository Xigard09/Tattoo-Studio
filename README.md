# Tattoo Studio

## Descripción del proyecto

Tattoo Studio es un proyecto formativo que consiste en desarrollar una aplicación web para la gestión de citas de un estudio de tatuajes.

El sistema busca facilitar la administración de clientes, tatuadores, servicios y reservas, permitiendo organizar los horarios y consultar la disponibilidad de los profesionales.

## Objetivo

Desarrollar una aplicación web que permita gestionar de manera organizada el proceso de programación de citas de un estudio de tatuajes.

## Tecnologías seleccionadas

| Tecnología | Función |
|---|---|
| PHP | Desarrollo del backend |
| Laravel | Framework backend |
| MySQL | Gestión de base de datos |
| HTML5 | Estructura de las interfaces |
| CSS3 | Diseño visual |
| JavaScript | Interactividad |
| Git | Control de versiones |
| GitHub | Almacenamiento del repositorio |

## Módulos principales

- **Clientes:** registro y administración de clientes.
- **Tatuadores:** gestión de profesionales y especialidades.
- **Servicios:** administración de los servicios ofrecidos.
- **Citas:** programación, consulta y cancelación de reservas.
- **Disponibilidad:** consulta de horarios disponibles.

## Base de datos

Utilizamos MySQL y la base de datos `tattoo_book` para almacenar la información del sistema.

Las principales entidades son:

- Cliente.
- Tatuador.
- Servicio.
- Cita.

## Arquitectura del sistema

Utilizamos el patrón MVC (Modelo-Vista-Controlador) mediante Laravel, separando la lógica del negocio, el acceso a datos y la presentación de la información.

## Estándares de codificación

- Variables: camelCase.
- Clases: PascalCase.
- Métodos: camelCase.
- Estándar de PHP: PSR-12.
- Organización de archivos según la estructura de Laravel.
- Documentación mediante comentarios descriptivos.

## Herramientas de desarrollo

- Visual Studio Code.
- XAMPP.
- Composer.
- MySQL Workbench.
- Git y GitHub.
- Postman.

## Estado del proyecto

Actualmente estamos en la etapa de desarrollo. Ya tenemos la API REST para el registro e inicio de sesión de clientes y la gestión de citas. Podemos consultar, crear, actualizar y cancelar citas desde Postman.

Los datos de tatuadores y servicios se utilizan en las citas. Todavía queda pendiente la integración de la API con las interfaces y el desarrollo de los demás módulos administrativos y de disponibilidad previstos en el proyecto.

## Ejecutar el backend

Para trabajar con la API necesitamos PHP 8.5, Composer y MySQL 8. Desde la carpeta del proyecto:

```bash
cd backend
composer install
```

Configurar el archivo `.env` con los datos de conexión local a MySQL y la base de datos `tattoo_book`. Si es una instalación nueva, copiar `.env.example` a `.env` y ejecutar `php artisan key:generate`. Si ya tenemos un `.env` configurado, podemos conservarlo.

La base de datos debe contar con las tablas del proyecto y las migraciones de autenticación correspondientes. Si se restaura una copia de la base de datos que ya incluye estas migraciones, no es necesario ejecutarlas nuevamente. No usar `migrate:fresh`, ya que elimina las tablas existentes.

Con MySQL iniciado, ejecutar:

```bash
php artisan serve
```

La API queda disponible en `http://127.0.0.1:8000/api/estado`.

## Pruebas de la API

Utilizamos Postman para comprobar las rutas y las respuestas de la API. La colección está guardada en la carpeta `postman/` del repositorio.

1. Abrir la colección Tattoo Studio API y seleccionar el entorno Tattoo Studio Local.
2. Comprobar la variable `base_url` e ingresar localmente la contraseña del cliente de prueba.
3. Iniciar sesión y utilizar el token obtenido en la variable `token`.
4. Realizar las pruebas de citas usando el identificador de una cita propia en `id_cita`.
5. Cerrar sesión y limpiar el token y la contraseña antes de guardar cambios en Git.

La documentación de las rutas, los ejemplos JSON y los resultados de las pruebas están en [API.md](API.md).

## Control de versiones

Utilizamos Git desde Visual Studio Code y GitHub como repositorio remoto. Registramos los cambios mediante commits descriptivos y los sincronizamos con `push` y `pull`.

Para desarrollar la API trabajamos en la rama `feature/api-rest`, sin modificar directamente la rama principal.

Repositorio: https://github.com/Xigard09/Tattoo-Studio

No se deben subir el archivo `.env`, las contraseñas ni los tokens de acceso al repositorio.
