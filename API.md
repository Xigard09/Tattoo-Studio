# Documentación técnica de la API REST - Tattoo Studio

## 1. Introducción

Tattoo Studio es nuestro proyecto formativo para gestionar las citas de un estudio de tatuajes.

En esta etapa desarrollamos la API REST para conectar el aplicativo con la base de datos. Por medio de la API podemos registrar clientes, iniciar sesión y gestionar las citas. También agregamos validaciones para evitar reservas en horarios ocupados y evitar que un cliente pueda modificar las citas de otro.

## 2. Información general

| Característica | Descripción |
|---|---|
| Proyecto | Tattoo Studio |
| Tipo de servicio | API REST |
| Versión | 1.0 |
| Formato de intercambio | JSON |
| Protocolo de desarrollo | HTTP |
| Zona horaria de las citas | America/Bogota |
| Autenticación | Bearer Token |
| Framework | Laravel 12 |
| Lenguaje | PHP 8.5 |
| Base de datos | MySQL 8 |
| Gestor de dependencias | Composer |
| Herramienta de pruebas | Postman |
| Control de versiones | Git y GitHub |
| Rama de desarrollo | feature/api-rest |

## 3. URL base

El servicio web se ejecuta localmente en:

```text
http://127.0.0.1:8000
```

Todas las rutas de la API utilizan el prefijo `/api`.

Para iniciar el servidor de desarrollo:

```bash
cd backend
php artisan serve
```

El servicio MySQL debe encontrarse activo y la conexión debe estar configurada en el archivo `.env` de Laravel.

## 4. Autenticación y seguridad

La API utiliza Laravel Sanctum para la autenticación de clientes mediante tokens de acceso.

El cliente debe iniciar sesión para obtener un token, el cual deberá enviar en las solicitudes protegidas.

### Encabezados HTTP

```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer TOKEN_DE_ACCESO
```

El encabezado Authorization únicamente es obligatorio para los endpoints protegidos.

Las contraseñas se almacenan mediante mecanismos de hashing y no deben exponerse en las respuestas de la API.

Los clientes únicamente pueden consultar, actualizar y cancelar sus propias citas.

## 5. Resumen de endpoints

| Método | Endpoint | Descripción | Autenticación |
|---|---|---|---|
| GET | /api/estado | Consultar estado de la API | No |
| POST | /api/registro | Registrar cliente | No |
| POST | /api/login | Iniciar sesión | No |
| GET | /api/user | Consultar cliente autenticado | Sí |
| POST | /api/logout | Cerrar sesión | Sí |
| GET | /api/citas | Consultar citas del cliente | Sí |
| GET | /api/citas/{id} | Consultar una cita específica | Sí |
| POST | /api/citas | Registrar una cita | Sí |
| PUT | /api/citas/{id} | Actualizar una cita | Sí |
| DELETE | /api/citas/{id} | Cancelar una cita | Sí |

## 6. Documentación de endpoints

### 6.1. Consultar estado de la API

**Método:** GET

**Endpoint:** `/api/estado`

**Autenticación:** No requerida.

**Descripción:** Permite verificar la disponibilidad y funcionamiento del servicio web.

**Respuesta exitosa:** HTTP 200 OK.

```json
{
    "proyecto": "Tattoo Studio",
    "servicio": "API REST",
    "version": "1.0",
    "estado": "Activo",
    "mensaje": "API funcionando correctamente"
}
```

### 6.2. Registro de cliente

**Método:** POST

**Endpoint:** `/api/registro`

**Autenticación:** No requerida.

**Descripción:** Permite registrar un nuevo cliente en el sistema.

#### Parámetros

| Campo | Tipo | Descripción |
|---|---|---|
| nombre | String | Nombre del cliente (máximo 100 caracteres) |
| telefono | String | Número telefónico (opcional, máximo 30 caracteres) |
| correo | String | Correo electrónico único (máximo 100 caracteres) |
| password | String | Contraseña de 8 a 72 caracteres |
| password_confirmation | String | Confirmación de contraseña |

#### Ejemplo de solicitud

```json
{
    "nombre": "Cliente Ejemplo",
    "telefono": "3001234567",
    "correo": "cliente@example.com",
    "password": "ContraseñaDeEjemplo123",
    "password_confirmation": "ContraseñaDeEjemplo123"
}
```

#### Códigos de respuesta

- 201 Created: cliente registrado correctamente.
- 422 Unprocessable Entity: datos inválidos o correo
  electrónico duplicado.

### 6.3. Inicio de sesión

**Método:** POST

**Endpoint:** `/api/login`

**Autenticación:** No requerida.

**Descripción:** Valida las credenciales del cliente y genera un token de acceso mediante Laravel Sanctum.

#### Ejemplo de solicitud

```json
{
    "correo": "cliente@example.com",
    "password": "ContraseñaDeEjemplo123"
}
```

#### Respuesta exitosa

HTTP 200 OK.

La respuesta contiene los datos del cliente autenticado y el token de acceso generado por el sistema.

El token deberá utilizarse como Bearer Token en las solicitudes protegidas.

#### Códigos de respuesta

- 200 OK: autenticación exitosa.
- 401 Unauthorized: credenciales incorrectas.
- 422 Unprocessable Entity: datos de entrada inválidos.

- 429 Too Many Requests: se superó el límite de solicitudes de inicio de sesión (5 por minuto).

### 6.4. Consultar cliente autenticado

**Método:** GET

**Endpoint:** `/api/user`

**Autenticación:** Requerida.

**Descripción:** Retorna la información del cliente asociado al token de acceso.

#### Ejemplo de respuesta

```json
{
    "id_cliente": 5,
    "nombre": "Cliente Prueba",
    "telefono": "3001234567",
    "correo": "prueba@example.com",
    "fecha_registro": "2026-11-24T05:00:00.000000Z"
}
```

#### Códigos de respuesta

- 200 OK: información obtenida correctamente.
- 401 Unauthorized: token inválido o ausente.

### 6.5. Cerrar sesión

**Método:** POST

**Endpoint:** `/api/logout`

**Autenticación:** Requerida.

**Descripción:** Revoca el token utilizado en la solicitud, impidiendo su uso posterior.

#### Códigos de respuesta

- 200 OK: sesión cerrada correctamente.
- 401 Unauthorized: token inválido o ausente.

### 6.6. Consultar citas

**Método:** GET

**Endpoint:** `/api/citas`

**Autenticación:** Requerida.

**Descripción:** Permite consultar las citas asociadas al cliente autenticado.

La información de las citas incluye sus datos y las relaciones correspondientes al tatuador y al servicio.

#### Códigos de respuesta

- 200 OK: consulta realizada correctamente.
- 401 Unauthorized: cliente no autenticado.

### 6.7. Consultar cita por ID

**Método:** GET

**Endpoint:** `/api/citas/{id}`

**Autenticación:** Requerida.

**Descripción:** Permite consultar la información de una cita específica perteneciente al cliente autenticado.

#### Parámetros de ruta

| Parámetro | Tipo | Descripción |
|---|---|---|
| id | Integer | Identificador de la cita |

#### Ejemplo de solicitud

```http
GET /api/citas/10
```

#### Códigos de respuesta

- 200 OK: cita encontrada.
- 401 Unauthorized: cliente no autenticado.
- 404 Not Found: cita inexistente o no perteneciente
  al cliente autenticado.

### 6.8. Registrar cita

**Método:** POST

**Endpoint:** `/api/citas`

**Autenticación:** Requerida.

**Descripción:** Permite registrar una nueva cita, validando los datos y la disponibilidad del tatuador.

#### Parámetros

| Campo | Tipo | Descripción |
|---|---|---|
| fecha_cita | Date | Fecha en formato YYYY-MM-DD |
| hora | String | Hora en formato HH:mm |
| id_tatuador | Integer | Identificador del tatuador |
| id_servicio | Integer | Identificador del servicio |

El identificador del cliente se obtiene mediante la autenticación y no debe enviarse en el cuerpo de la solicitud.

#### Ejemplo de solicitud

```json
{
    "fecha_cita": "2026-12-16",
    "hora": "16:00",
    "id_tatuador": 1,
    "id_servicio": 2
}
```

#### Ejemplo de respuesta exitosa

HTTP 201 Created.

```json
{
    "mensaje": "Cita registrada correctamente.",
    "cita": {
        "id_cita": 13,
        "fecha_cita": "2026-12-16",
        "hora": "16:00",
        "estado_cita": "Pendiente",
        "id_cliente": 5,
        "id_tatuador": 1,
        "id_servicio": 2,
        "tatuador": {
            "id_tatuador": 1,
            "nombre": "Juan Torres",
            "especialidad": "Realismo"
        },
        "servicio": {
            "id_servicio": 2,
            "nombre_servicio": "Tatuaje mediano",
            "descripcion": "Tatuaje de tamaño mediano",
            "duracion_estimada": "2 horas",
            "estado": "Activo"
        }
    }
}
```

#### Ejemplo de conflicto de horario

HTTP 409 Conflict.

```json
{
    "mensaje": "El tatuador ya tiene una cita en ese horario."
}
```

#### Códigos de respuesta

- 201 Created: cita registrada correctamente.
- 401 Unauthorized: cliente no autenticado.
- 409 Conflict: conflicto de disponibilidad.
- 422 Unprocessable Entity: datos inválidos.

### 6.9. Actualizar cita

**Método:** PUT

**Endpoint:** `/api/citas/{id}`

**Autenticación:** Requerida.

**Descripción:** Permite modificar la fecha, hora, tatuador y servicio de una cita perteneciente al cliente autenticado.

Solo permitimos modificar citas con estado Pendiente. Al actualizar una cita volvemos a comprobar el horario del tatuador, sin contar la misma cita como un conflicto.

#### Ejemplo de solicitud

```http
PUT /api/citas/12
```

```json
{
    "fecha_cita": "2026-12-16",
    "hora": "16:00",
    "id_tatuador": 1,
    "id_servicio": 2
}
```

#### Ejemplo de respuesta exitosa

HTTP 200 OK.

```json
{
    "mensaje": "Cita actualizada correctamente.",
    "cita": {
        "id_cita": 12,
        "fecha_cita": "2026-12-16",
        "hora": "16:00",
        "estado_cita": "Pendiente",
        "id_cliente": 5,
        "id_tatuador": 1,
        "id_servicio": 2
    }
}
```

El ejemplo anterior muestra los campos principales.
La respuesta también incluye las relaciones del tatuador y del servicio.

#### Códigos de respuesta

- 200 OK: cita actualizada correctamente.
- 401 Unauthorized: cliente no autenticado.
- 404 Not Found: cita inexistente o no autorizada.
- 409 Conflict: horario ocupado o cita que no está pendiente.
- 422 Unprocessable Entity: datos inválidos.

### 6.10. Cancelar cita

**Método:** DELETE

**Endpoint:** `/api/citas/{id}`

**Autenticación:** Requerida.

**Descripción:** Permite cancelar una cita mediante una eliminación lógica.

El registro permanece almacenado en la base de datos y su estado cambia a Cancelada, conservando el historial de agendamientos.

#### Ejemplo de solicitud

```http
DELETE /api/citas/13
```

No requiere cuerpo JSON. Solo se pueden cancelar citas pendientes o confirmadas que todavía no hayan vencido.

#### Ejemplo de respuesta exitosa

HTTP 200 OK.

```json
{
    "mensaje": "Cita cancelada correctamente.",
    "cita": {
        "id_cita": 13,
        "fecha_cita": "2026-12-16",
        "hora": "16:00:00",
        "estado_cita": "Cancelada",
        "id_cliente": 5,
        "id_tatuador": 1,
        "id_servicio": 2
    }
}
```

La respuesta también incluye las relaciones del tatuador y del servicio.

#### Ejemplo de cancelación no permitida

HTTP 409 Conflict.

```json
{
    "mensaje": "La cita no se puede cancelar en su estado actual."
}
```

#### Ejemplo de cita vencida

HTTP 409 Conflict.

```json
{
    "mensaje": "No se puede cancelar una cita vencida."
}
```

#### Códigos de respuesta

- 200 OK: cita cancelada correctamente.
- 401 Unauthorized: cliente no autenticado.
- 404 Not Found: cita inexistente o no autorizada.
- 409 Conflict: estado de cita incompatible o cita vencida.

## 7. Reglas de negocio

Estas son las reglas que aplicamos en el backend:

1. El correo del cliente debe ser único y la contraseña se guarda mediante hashing.
2. Las rutas protegidas requieren un token válido.
3. Cada cliente solo puede consultar y gestionar sus propias citas.
4. El tatuador debe existir y el servicio debe existir y estar activo.
5. La fecha y hora de la cita deben ser futuras. Para las comparaciones de horarios usamos la zona `America/Bogota`.
6. Para comprobar si un horario está ocupado, tenemos en cuenta la duración del servicio y las citas pendientes o confirmadas del tatuador.
7. Las citas nuevas quedan en estado Pendiente.
8. Solo se pueden modificar citas pendientes.
9. Solo se pueden cancelar citas pendientes o confirmadas que no hayan vencido.
10. Al cancelar una cita cambiamos su estado a Cancelada, sin borrar el registro. El horario queda disponible nuevamente.
11. Usamos transacciones y bloqueos de registros para controlar solicitudes simultáneas.

## 8. Control de concurrencia

Agregamos transacciones con `DB::transaction()` y bloqueos con `lockForUpdate()` para evitar que dos solicitudes reserven el mismo horario al mismo tiempo. Para comprobarlo realizamos las siguientes pruebas.

Durante las pruebas se utilizaron dos instancias del servidor Laravel:

- http://127.0.0.1:8000
- http://127.0.0.1:8001

Ambas instancias utilizaron la misma base de datos MySQL.

Se enviaron solicitudes simultáneas mediante PowerShell y cURL para verificar el comportamiento del sistema.

### Registro simultáneo de citas

Se enviaron dos solicitudes para reservar el mismo horario con el mismo tatuador.

Resultados obtenidos:

- Una solicitud retornó HTTP 201 Created.
- La otra solicitud retornó HTTP 409 Conflict.
- MySQL confirmó la existencia de un único agendamiento
  para el horario evaluado.

### Cancelación simultánea de citas

Se enviaron dos solicitudes para cancelar la misma cita.

Resultados obtenidos:

- Una solicitud retornó HTTP 200 OK.
- La otra solicitud retornó HTTP 409 Conflict.
- MySQL confirmó que el estado final de la cita
  correspondía a Cancelada.

Con estas pruebas comprobamos que no se duplicó la reserva y que la misma cita no se canceló dos veces.

## 9. Códigos de respuesta HTTP

| Código | Estado | Descripción |
|---|---|---|
| 200 | OK | Operación realizada correctamente |
| 201 | Created | Recurso creado correctamente |
| 401 | Unauthorized | Autenticación inválida o ausente |
| 404 | Not Found | Recurso inexistente o no accesible |
| 409 | Conflict | Conflicto con las reglas de negocio |
| 422 | Unprocessable Entity | Error de validación |
| 429 | Too Many Requests | Límite de solicitudes superado |
| 500 | Internal Server Error | Error interno del servidor |

## 10. Base de datos

La API utiliza una base de datos relacional MySQL denominada `tattoo_book`.

### Tablas principales

| Tabla | Función |
|---|---|
| cliente | Almacena la información de los clientes |
| cita | Almacena los agendamientos |
| tatuador | Almacena los datos de los tatuadores |
| servicio | Almacena los servicios disponibles |
| personal_access_tokens | Gestiona los tokens de Sanctum |

Las relaciones entre las tablas permiten mantener la integridad referencial y consultar la información asociada a cada agendamiento.

## 11. Pruebas funcionales

Las pruebas se realizaron utilizando Postman,
MySQL Workbench y PowerShell.

| Prueba | Resultado esperado | Estado |
|---|---|---|
| Consultar estado de la API | HTTP 200 | Aprobada |
| Registrar cliente | HTTP 201 | Aprobada |
| Registrar datos inválidos | HTTP 422 | Aprobada |
| Iniciar sesión | HTTP 200 | Aprobada |
| Credenciales incorrectas | HTTP 401 | Aprobada |
| Consultar cliente autenticado | HTTP 200 | Aprobada |
| Acceder sin autenticación | HTTP 401 | Aprobada |
| Cerrar sesión | HTTP 200 | Aprobada |
| Utilizar token revocado | HTTP 401 | Aprobada |
| Consultar citas | HTTP 200 | Aprobada |
| Consultar cita por ID | HTTP 200 | Aprobada |
| Registrar cita disponible | HTTP 201 | Aprobada |
| Registrar citas simultáneas | HTTP 201 y 409 | Aprobada |
| Actualizar cita | HTTP 200 | Aprobada |
| Actualizar cita con horario ocupado | HTTP 409 | Aprobada |
| Actualizar cita con fecha anterior | HTTP 422 | Aprobada |
| Actualizar cita de otro cliente | HTTP 404 | Aprobada |
| Cancelar cita | HTTP 200 | Aprobada |
| Cancelar cita previamente cancelada | HTTP 409 | Aprobada |
| Cancelar cita vencida | HTTP 409 | Aprobada |
| Cancelar cita de otro cliente | HTTP 404 | Aprobada |
| Reutilizar horario de cita cancelada | HTTP 201 | Aprobada |
| Cancelar citas simultáneamente | HTTP 200 y 409 | Aprobada |

## 12. Colección de Postman

La colección de pruebas se encuentra versionada dentro del repositorio del proyecto.

```text
postman/
├── collections/
│   └── Tattoo Studio API/
│       ├── Autenticacion/
│       ├── Estado de la API/
│       └── Gestion de citas/
├── environments/
└── globals/
```

### Variables de entorno

| Variable | Descripción |
|---|---|
| base_url | Dirección base del servicio web |
| token | Token de autenticación |
| id_cita | Identificador de la cita seleccionada |
| password | Contraseña del cliente de pruebas |

El entorno Tattoo Studio Local contiene la configuración necesaria para ejecutar las solicitudes.

Los valores sensibles de token y password se mantienen vacíos en el repositorio por motivos de seguridad.

Cada desarrollador debe configurar sus credenciales localmente y evitar incluirlas en los commits.

### Flujo recomendado de pruebas

1. Iniciar MySQL.
2. Iniciar el servidor Laravel.
3. Abrir la colección en Postman.
4. Seleccionar el entorno Tattoo Studio Local.
5. Configurar la contraseña de pruebas localmente.
6. Consultar el estado de la API.
7. Registrar un cliente si es necesario.
8. Iniciar sesión.
9. Configurar el token obtenido localmente.
10. Consultar y registrar citas.
11. Configurar el identificador de una cita propia.
12. Actualizar o cancelar la cita.
13. Cerrar sesión.
14. Limpiar las credenciales antes de realizar commits.

Las fechas y los identificadores utilizados en los ejemplos deben ajustarse a los registros disponibles y a la fecha de ejecución de las pruebas.

## 13. Control de versiones

El desarrollo de la API REST se encuentra versionado mediante Git y GitHub.

Repositorio:

https://github.com/Xigard09/Tattoo-Studio

Rama de desarrollo:

feature/api-rest

### Historial de implementación

| Commit | Descripción |
|---|---|
| 121ecb3 | Instalación y configuración inicial de Laravel |
| 8da9f05 | Configuración de Sanctum y primer endpoint REST |
| 1033bbb | Implementación de autenticación de clientes |
| 17e89b4 | Modelos y endpoints de consulta y registro de citas |
| 7acf262 | Validación de solapamiento y concurrencia |
| 089dd36 | Actualización de citas y autorización |
| e9bd75d | Cancelación lógica y control de concurrencia |
| 52b2eb8 | Organización y configuración de Postman |

El uso de una rama independiente permite desarrollar los servicios web sin modificar directamente la rama principal del proyecto.

## 14. Conclusiones

Con el desarrollo de la API logramos realizar el registro e inicio de sesión de los clientes y las operaciones de consulta, creación, actualización y cancelación de citas.

Durante las pruebas encontramos casos que debíamos controlar, como los horarios ocupados, las citas vencidas y las solicitudes de clientes sin autorización. Fuimos agregando las validaciones y comprobando los resultados con Postman y MySQL.

Con esta parte del backend tenemos una base para continuar con la integración de las interfaces del aplicativo. Dejamos las rutas y las pruebas documentadas para que los demás integrantes del equipo puedan continuar trabajando en el proyecto.

## 15. Referencias

- Laravel. Documentación oficial.
  https://laravel.com/docs/12.x

- Laravel Sanctum. Documentación oficial.
  https://laravel.com/docs/12.x/sanctum

- MySQL. Documentación oficial.
  https://dev.mysql.com/doc/

- Postman. Documentación oficial.
  https://learning.postman.com/docs/

- Git. Documentación oficial.
  https://git-scm.com/doc

- MDN Web Docs. Códigos de estado de respuesta HTTP.
  https://developer.mozilla.org/es/docs/Web/HTTP/Status

---

Documento elaborado para la evidencia
GA7-220501096-AA5-EV03_ITC.

Programa de formación: Análisis y Desarrollo de Software.

Servicio Nacional de Aprendizaje - SENA.

Proyecto formativo: Tattoo Studio.

Noviembre de 2026.