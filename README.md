## Notas

Una aplicacion web construida con Vite+React y MySQL con acciones REST y autenticacion/proteccion de endpoints donde podran crearse 3 tipos de usuarios desde el administrador, el profesor, y los estudiantes y cada uno tendra una pagina para visualizar los datos que necesitan utilizar.


## Table of Contents

- [Proyecto de Notas](#notas)
  - [Table of Contents](#table-of-contents)
  - [About](#about)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Usage](#usage)
  - [Contact](#contact)

## About

El proposito de la aplicacion web es para que los estudiantes puedan revisar sus calificaciones de sus trabajos y examenes recientes actualizados por sus profesores.

Y los profesores podran seleccionar a sus estudiantes y colocar los resultados de sus notas.

Y un panel de administracion donde podemos agregar credenciales nuevas para estudiantes y profesores nuevos.

## Features

-Informacion en vivo de usuario que inicia sesion.
-Se mantiene la sesion del usuario por navegador usando localStorage
-Se protegen las rutas en el frontend para que no puedan navegar por donde no se supone que deban.
-Se protegen los endpoints de el servidor para que tampoco puedan manipular los datos de las tablas sin haber iniciado sesion.
-Campos de formulario requeridos.

## Getting Started

1. Asegurate de tener un servidor SQL https://dev.mysql.com/downloads/installer/
2. Crea una base de datos con el nombre de tu preferencia. 
3. Crea o modifica el archivo .env.example a solo .env y llena las variables DB_USER, DB_PASSWORD y DB_NAME con los valores necesarios.
4. Instalar Node.js https://nodejs.org/en

### Installation

1. En el Folder raiz, corre el comando npm install.
2. luego cd /frontend , y tambien corre npm install.

## Usage

- En el folder raiz puedes correr npm start. (Para correr el servidor backend)
- En el folder /frontend utliza npm run dev (Para correr el servidor Front-end)

## Contact

- Integrante 1
- Integrante 2
- Integrante 3
- Integrante 4