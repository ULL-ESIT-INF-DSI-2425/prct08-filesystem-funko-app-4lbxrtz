// import { appendFile } from "fs";
// Propósito: Añadir datos a un archivo de forma asíncrona, creándolo si no existe.
// // Ejemplo básico
// appendFile("message.txt", "Hola Mundo\n", (err) => {
//   if (err) throw err;
//   console.log("Datos añadidos al archivo");
// });

// // Con opciones
// appendFile(
//   "message.txt",
//   "Más datos",
//   {
//     encoding: "utf8",
//     flag: "a", // append by default
//     mode: 0o644, // mask for the file created
//   },
//   (err) => {
//     if (err) throw err;
//     console.log("Datos añadidos con opciones específicas");
//   },
// );

// import { readFile } from "fs";
// Propósito: Leer todo el contenido de un archivo de forma asíncrona.
// // Nota importante: No usar para archivos muy grandes (mejor usar streams).
// // Leer como buffer (sin encoding)
// readFile("message.txt", (err, data) => {
//   if (err) throw err;
//   console.log(data); // <Buffer 48 6f 6c 61 20 4d 75 6e 64 6f>
// });

// // Leer como string (con encoding) (Tambien podriamos hacer data.toString() y lograr lo mismo)
// readFile("message.txt", "utf8", (err, data) => {
//   if (err) throw err;
//   console.log(data); // "Hola Mundo"
// });

// // Con opciones de objeto
// readFile("message.txt", { encoding: "utf8", flag: "r" }, (err, data) => {
//   if (err) throw err;
//   console.log(data);
// });

// import { readdir } from "fs";
// Propósito: Leer el contenido de un directorio.
// // Listado básico de archivos
// readdir("./", (err, files) => {
//   if (err) throw err;
//   console.log(files); // ['app.js', 'package.json', 'node_modules']
// });

// // Con opciones avanzadas
// readdir(
//   "./",
//   {
//     encoding: "utf8",
//     withFileTypes: true,
//     // recursive: true,
//   },
//   (err, files) => {
//     if (err) throw err;
//     files.forEach((file) => {
//       if (file.isDirectory()) {
//         console.log(`Directorio: ${file.name}`);
//       } else {
//         console.log(`Archivo: ${file.name}`);
//       }
//     });
//   },
// );

// import { open, read, close } from 'fs';
// Propósito: Abrir un archivo para operaciones de bajo nivel.
// Flags comunes:
// 'r': Leer (default)

// 'w': Escribir (trunca el archivo)

// 'a': Append

// 'r+': Leer y escribir

// open('archivo.txt', 'r+', (err, fd) => {
//   if (err) throw err;

//   // Operaciones con el descriptor de archivo (fd)
//   // ...

//   close(fd, (err) => {
//     if (err) throw err;
//   });
// });

// import { open, read } from "fs";
// Propósito: Leer datos desde un descriptor de archivo.
// const buffer = Buffer.alloc(1024);

// open("archivo.txt", "r", (err, fd) => {
//   if (err) throw err;

//   read(fd, buffer, 0, buffer.length, 0, (err, bytesRead, buffer) => {
//     if (err) throw err;
//     console.log(
//       `Leídos ${bytesRead} bytes: ${buffer.toString("utf8", 0, bytesRead)}`,
//     );
//   });
// });

// import { opendir } from "fs";

// Propósito: Abrir un directorio para lectura iterativa.
// Ventaja: Más eficiente para directorios grandes que readdir
// opendir("./", (err, dir) => {
//   if (err) throw err;

//   const readNext = () => {
//     dir.read((err, dirent) => {
//       if (err) {
//         throw err; // Manejo de errores explícito
//         return; // Aunque el throw interrumpe, TypeScript quiere ver un return
//       }

//       if (dirent === null) {
//         dir.close();
//         return; // Retorno explícito
//       }

//       console.log(dirent.name);
//       readNext(); // Leer siguiente entrada
//       return; // Retorno explícito para consistencia
//     });
//   };

//   readNext();
// });

// import { mkdir } from 'fs';
// Nota: Con recursive: true crea todos los directorios necesarios en la ruta.
// // Creación simple
// mkdir('nuevo-dir', (err) => {
//   if (err) throw err;
// });

// // Creación recursiva
// mkdir('ruta/completa/de/directorios', { recursive: true }, (err, path) => {
//   if (err) throw err;
//   console.log(`Creado: ${path}`);
// });

// import { copyFile, constants } from 'fs';
// Flags importantes:

//     COPYFILE_EXCL: Falla si el destino existe

//     COPYFILE_FICLONE: Usa copy-on-write si está disponible
// // Copia básica
// copyFile('origen.txt', 'destino.txt', (err) => {
//   if (err) throw err;
// });

// // Copia con flags
// copyFile('origen.txt', 'destino.txt', constants.COPYFILE_EXCL, (err) => {
//   if (err && err.code === 'EEXIST') {
//     console.log('El archivo destino ya existe');
//     return;
//   }
//   if (err) throw err;
// });

// import { cp } from "fs";
// Propósito: Copiar archivos o directorios completos (Node.js v16.7.0+).
// Ventaja sobre copyFile: Soporta copias recursivas de directorios completos.
// // Copiar archivo
// cp("origen.txt", "destino.txt", (err) => {
//   if (err) throw err;
// });

// // Copiar directorio recursivamente
// cp(
//   "directorio-origen",
//   "directorio-destino",
//   {
//     recursive: true,
//     filter: (src, dest) => {
//       // No copiar archivos .tmp
//       return !src.endsWith(".tmp");
//     },
//   },
//   (err) => {
//     if (err) throw err;
//   },
// );

// import { realpath } from "fs";
// Propósito: Obtener la ruta canónica resolviendo ., .. y enlaces simbólicos.
// realpath("./../funkos/./enums/../enlaces", (err, resolvedPath) => {
//   if (err) throw err;
//   console.log(`Ruta canónica: ${resolvedPath}`);
//   // Ejemplo: "/home/usuario/proyectos/ruta/enlaces"
// });

// // Con opción de buffer
// realpath("./enlace-simbolico", { encoding: "buffer" }, (err, resolvedPath) => {
//   if (err) throw err;
//   console.log(resolvedPath); // <Buffer 2f 65 74 63 2f 70 61 73 73 77 64>
// });

// import { rename } from "fs";
// Propósito: Renombrar o mover archivos/directorios.
// No puede sobrescribir directorios no vacíos
// // Renombrar archivo
// rename("viejo-nombre.txt", "nuevo-nombre.txt", (err) => {
//   if (err) throw err;
//   console.log("Archivo renombrado");
// });

// // Mover archivo entre directorios
// rename("/ruta/origen/archivo.txt", "/ruta/destino/archivo.txt", (err) => {
//   if (err) {
//     if (err.code === "EXDEV") {
//       // Manejar caso de dispositivos diferentes (necesitaría copy + delete)
//       console.error("No se puede mover entre dispositivos directamente");
//     } else {
//       throw err;
//     }
//   }
// });

// import { rm } from 'fs';

// // Eliminar recursivamente (forma moderna)
// rm('directorio-con-contenido', {
//   recursive: true,
//   force: true,
//   maxRetries: 3,
//   retryDelay: 100
// }, (err) => {
//   if (err) throw err;
//   console.log('Directorio y contenido eliminado');
// });

// // Eliminar archivo
// rm('archivo.txt', (err) => {
//   if (err) throw err;
// });

// import { stat } from "fs";
// Propósito: Obtener información detallada sobre un archivo/directorio.
// Métodos útiles del objeto Stats:

//     .isFile() - ¿Es archivo regular?

//     .isDirectory() - ¿Es directorio?

//     .isSymbolicLink() - ¿Es symlink? (solo con lstat)

//     .size - Tamaño en bytes

//     .mtime - Fecha de modificación
// stat("archivo.txt", (err, stats) => {
//   if (err) throw err;

//   console.log("Información completa:", stats);
//   console.log("Es archivo:", stats.isFile());
//   console.log("Es directorio:", stats.isDirectory());
//   console.log("Tamaño (bytes):", stats.size);
//   console.log("Última modificación:", stats.mtime);
// });

// // Con bigint para sistemas de archivos grandes
// stat("archivo-grande.iso", { bigint: true }, (err, stats) => {
//   if (err) throw err;
//   console.log("Tamaño exacto para >2GB:", stats.size);
// });

// import { watch } from 'fs';
// Propósito: Monitorear cambios en archivos/directorios.
// // Monitorear archivo individual
// const watcher = watch('archivo-importante.log', { persistent: true }, (eventType, filename) => {
//   console.log(`Evento: ${eventType} en ${filename}`);

//   if (eventType === 'change') {
//     console.log('El archivo fue modificado');
//   }
// });

// // Para detener el watcher después de 1 minuto
// setTimeout(() => {
//   watcher.close();
// }, 60000);

// // Monitorear directorio recursivamente
// watch('directorio', { recursive: true }, (eventType, filename) => {
//   console.log(`Cambio detectado en: ${filename}`);
// });
