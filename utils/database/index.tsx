// import dayjs from "dayjs";
// import * as SQLite from "expo-sqlite";

// const db = SQLite.openDatabaseAsync("databaseName");

// const dbNombre = "rn_sqllite";

// // export async function getDbConeccion() {
// //   const db = await openDatabase({
// //     name: dbNombre,
// //     location: 'default',
// //   });
// //   return db;
// // }

// export const crearTablaUsuarios = (db: any) => {
//   const query = `CREATE TABLE IF NOT EXISTS usuarios (
//     codigo TEXT NULL,
//     usuario TEXT NULL,
//     nombre TEXT NULL,
//     urlImagen TEXT NULL,
//     codigoCelda TEXT NULL,
//     codigoPanal TEXT NULL,
//     codigoCiudad TEXT NULL,
//     codigoPuesto TEXT NULL,
//     codigoTercero TEXT NULL,
//     codigoOperador TEXT NULL,
//     calidadImagen TEXT NULL,
//     codigoOperacion TEXT NULL,
//     celda TEXT NULL,
//     operador TEXT NULL,
//     puntoServicio TEXT NULL,
//     puntoServicioToken TEXT NULL,
//     tokenFireBase TEXT NULL
//   );`;
//   return db.executeSql(query);
// };

// export const crearTablaDespachos = (db: any) => {
//   const query = `CREATE TABLE IF NOT EXISTS despachos (
//     codigoDespacho TEXT NULL,
//     usuario TEXT NULL,
//     codigoDespachoClaseFk TEXT NULL,
//     codigoDespachoPk TEXT NULL,
//     codigoOperadorFk TEXT NULL,
//     estadoEntregado TEXT NULL,
//     fecha TEXT NULL,
//     fechaDespacho TEXT NULL,
//     operadorNombre TEXT NULL,
//     token TEXT NULL,
//     estadoGestionGuias TEXT NULL
//   );`;
//   return db.executeSql(query);
// };

// export const crearTablaGuia = (db: any) => {
//   const query = `CREATE TABLE IF NOT EXISTS guias (
//     codigoGuia TEXT NULL,
//     fechaIngreso TEXT NULL,
//     documentoCliente TEXT NULL,
//     unidades TEXT NULL,
//     pesoReal TEXT NULL,
//     estadoNovedad TEXT NULL,
//     nombreRemitente TEXT NULL,
//     destinatario TEXT NULL,
//     telefonoDestinatario TEXT NULL,
//     direccionDestinatario TEXT NULL,
//     vrCobroEntrega TEXT NULL,
//     destino TEXT NULL,
//     departamentoDestinoNombre TEXT NULL,
//     token TEXT NULL,
//     operador TEXT NULL,
//     despacho TEXT NULL,
//     estadoEntregado TEXT DEFAULT '0',
//     fechaEntrega TEXT NULL,
//     usuarioEntrega TEXT NULL,
//     recibe TEXT NULL,
//     numeroIdentificacion TEXT NULL,
//     parentesco TEXT NULL,
//     celular TEXT NULL,
//     estadoSincronizado TEXT DEFAULT '0',
//     sincronizadoError TEXT DEFAULT '0',
//     sincronizadoErrorMensaje TEXT null
//   );`;
//   return db.executeSql(query);
// };
// export const crearTablaGuiaImagenes = (db: any) => {
//   const query = `CREATE TABLE IF NOT EXISTS guiaImagenes (
//     codigoGuia TEXT NULL,
//     path TEXT NULL,
//     tipo TEXT NULL
//   );`;
//   return db.executeSql(query);
// };
// export const crearTablaDestinos = (db: any) => {
//   const query = `CREATE TABLE IF NOT EXISTS destinos (
//     codigoDestino TEXT NULL,
//     destino TEXT NULL,
//     token TEXT NULL,
//     operador TEXT NULL,
//     despacho TEXT NULL,
//     codigoOperador TEXT NULL
//   );`;
//   return db.executeSql(query);
// };

// export const crearTablaDespachoNovedad = (db: any) => {
//   const query = `CREATE TABLE IF NOT EXISTS despachoNovedad (
//     codigoDespacho TEXT NULL,
//     codigoNovedadTipo TEXT NULL,
//     descripcion TEXT NULL,
//     codigoGuia TEXT NULL
//   );`;
//   return db.executeSql(query);
// };

// export const crearTablaNovedadTipos = (db: any) => {
//   const query = `CREATE TABLE IF NOT EXISTS novedadTipos (
//     codigoNovedadTipoPk TEXT NULL,
//     nombre TEXT NULL,
//     codigoOperador TEXT NULL
//   );`;
//   return db.executeSql(query);
// };

// export const crearTablaOperador = (db: any) => {
//   const query = `CREATE TABLE IF NOT EXISTS operadores (
//     codigoOperadorPk TEXT NULL,
//     nombre TEXT NULL,
//     sincronizado blob default false,
//     fechaSincronizado TEXT NULL,
//     calidadImagenEntrega TEXT NULL,
//     exigeImagenEntrega TEXT DEFAULT '0',
//     exigeFirmaEntrega TEXT DEFAULT '0'
//   );`;
//   return db.executeSql(query);
// };

// export const obtenerDespachos = async (db: any) => {
//   const despachos = [];
//   const resultados = await db.executeSql(`select * from despachos`);
//   resultados.forEach((element) => {
//     for (let index = 0; index < element.rows.length; index++) {
//       despachos.push(element.rows.item(index));
//     }
//   });
//   return despachos;
// };

// export const obtenerUsuarios = async (db: any , usuario: any) => {
//   const usuarios = [];
//   const resultados = await db.executeSql(
//     `select * from usuarios where usuario = '${usuario}'`
//   );
//   resultados.forEach((element) => {
//     for (let index = 0; index < element.rows.length; index++) {
//       usuarios.push(element.rows.item(index));
//     }
//   });
//   return usuarios;
// };

// export const obtenerOperadores = async (db: any) => {
//   const operadores = [];
//   const resultados = await db.executeSql(
//     "select * from operadores ORDER BY codigoOperadorPk DESC"
//   );
//   resultados.forEach((element) => {
//     for (let index = 0; index < element.rows.length; index++) {
//       operadores.push(element.rows.item(index));
//     }
//   });
//   return operadores;
// };

// export const obtenerNovedadesTipo = async (db : any) => {
//   const data = [];
//   const resultados = await db.executeSql(
//     "select * from novedadTipos ORDER BY codigoNovedadTipoPk DESC"
//   );
//   resultados.forEach((element) => {
//     for (let index = 0; index < element.rows.length; index++) {
//       data.push(element.rows.item(index));
//     }
//   });
//   return data;
// };

// export const obtenerGuias = async (
//   db: any,
//   operador: any,
//   token: any,
//   despacho: any,
//   destino: any
// ) => {
//   const data: any = [];
//   let query = `select * from guias where token = '${token}' and operador = '${operador}' and despacho = '${despacho}' and estadoEntregado = 0`;
//   if (destino !== "") {
//     query = query + ` and destino = '${destino}'`;
//   }
//   const resultados = await db.executeSql(query);
//   resultados.forEach((element: any) => {
//     for (let index = 0; index < element.rows.length; index++) {
//       data.push(element.rows.item(index));
//     }
//   });
//   return data;
// };

// export const obtenerGuiasEntregaPendiente = async (
//   db: any,
//   operador: any,
//   token: any,
//   despacho: any
// ) => {
//   const data = [];
//   const resultados = await db.executeSql(
//     `select 
//     guias.codigoGuia,
//     guias.recibe,
//     guias.parentesco,
//     guias.numeroIdentificacion,
//     guias.celular,
//     guias.operador,
//     guias.despacho as codigoDespacho,
//     guias.usuarioEntrega as usuario,
//     guias.fechaEntrega
//     from guias
//     where 
//       token = '${token}' 
//       and operador = '${operador}' 
//       and despacho = '${despacho}'
//       and estadoEntregado = 1`
//   );
//   resultados.forEach((element) => {
//     for (let index = 0; index < element.rows.length; index++) {
//       data.push(element.rows.item(index));
//     }
//   });
//   return data;
// };

// export const obtenerDestinos = async (
//   db: any,
//   codigoOperador: any,
//   token: any,
//   codigoDespacho: any
// ) => {
//   const data = [];
//   const resultados = await db.executeSql(
//     `select * from destinos where token = '${token}' and codigoOperador = '${codigoOperador}' and despacho = '${codigoDespacho}' `
//   );
//   resultados.forEach((element) => {
//     for (let index = 0; index < element.rows.length; index++) {
//       data.push(element.rows.item(index));
//     }
//   });
//   return data;
// };

// export const obtenerCalidadImagen = async (db: any, codigoOperador: any) => {
//   const data = [];
//   const resultados = await db.executeSql(
//     `select calidadImagenEntrega, exigeImagenEntrega, exigeFirmaEntrega from operadores where codigoOperadorPk = '${codigoOperador}'`
//   );
//   resultados.forEach((element) => {
//     for (let index = 0; index < element.rows.length; index++) {
//       data.push(element.rows.item(index));
//     }
//   });
//   return data;
// };

// export const obtenerGuiasNovedad = async (db: any, codigoDespacho: any) => {
//   const data = [];
//   const resultados = await db.executeSql(
//     `select * from despachoNovedad where codigoDespacho = '${codigoDespacho}'`
//   );
//   resultados.forEach((element) => {
//     for (let index = 0; index < element.rows.length; index++) {
//       data.push(element.rows.item(index));
//     }
//   });
//   return data;
// };

// export const obtenerGuiaImagenes = async (db: any, codigoGuia: any) => {
//   const data: any = [];
//   const resultados = await db.executeSql(
//     `select * from guiaImagenes where codigoGuia = ${codigoGuia}`
//   );
//   resultados.forEach((element: any) => {
//     for (let index = 0; index < element.rows.length; index++) {
//       data.push(element.rows.item(index));
//     }
//   });
//   return data;
// };

// export const obtenerOperadoresSincronizados = async (db: any, operador: any) => {
//   const data = [];
//   const resultados = await db.executeSql(
//     `select codigoOperadorPk from operadores where codigoOperadorPk = '${operador}'`
//   );
//   resultados.forEach((element) => {
//     for (let index = 0; index < element.rows.length; index++) {
//       data.push(element.rows.item(index));
//     }
//   });
//   return data;
// };

// export const guardarUsuarioOffline = (db: any, usuarioInformacion: any) => {
//   delete usuarioInformacion.tienda;
//   delete usuarioInformacion.oferta;
//   delete usuarioInformacion.habilitadoConfiguracion;
//   const keys = Object.keys(usuarioInformacion);
//   const values = JSON.stringify(Object.values(usuarioInformacion));
//   let str = values.slice(1, values.length - 1);
//   const query = `INSERT INTO usuarios (${keys}) values (${str})`;
//   return db.executeSql(query);
// };

// export const guardarDespachos = (db: any, data: any) => {
//   data.estadoEntregado = data.estadoEntregado ? "1" : "0";
//   let keys = Object.keys(data);
//   let values = JSON.stringify(Object.values(data));
//   let str = values.slice(1, values.length - 1);
//   const query = `INSERT INTO despachos (${keys}) values (${str})`;
//   db.executeSql(query);
// };

// export const guardarNovedadesTipo = (db: any, data: any, codigoOperador: any) => {
//   for (const iterator of data) {
//     let keys = Object.keys(iterator);
//     let values = JSON.stringify(Object.values(iterator));
//     let str = values.slice(1, values.length - 1);
//     let query = `INSERT INTO novedadTipos (${keys},codigoOperador) values (${str}, '${codigoOperador}')`;
//     db.executeSql(query);
//   }
// };

// export const guardarOperador = (db: any, data: any) => {
//   const date = dayjs();
//   data.codigoOperadorPk = data.codigoOperadorConfiguracionPk;
//   data.exigeImagenEntrega = data.exigeImagenEntrega ? "1" : "0";
//   data.exigeFirmaEntrega = data.exigeFirmaEntrega ? "1" : "0";
//   data.sincronizado = "1";
//   data.fechaSincronizado = date.format("DD/MM/YYYY h:mm");
//   delete data.codigoOperadorConfiguracionPk;
//   let keys = Object.keys(data);
//   let values = JSON.stringify(Object.values(data));
//   let str = values.slice(1, values.length - 1);
//   const query = `INSERT INTO operadores (${keys}) values (${str})`;
//   db.executeSql(query);
// };

// export const guardarGuias = (db: any, data: any, token: any, operador: any, despacho: any) => {
//   data.map(async (element) => {
//     element.estadoNovedad = element.estadoNovedad ? "1" : "0";
//     let keys = Object.keys(element);
//     let values = JSON.stringify(Object.values(element));
//     let str = values.slice(1, values.length - 1);
//     const query = `INSERT INTO guias (${keys},token,operador,despacho) values (${str}, '${token}','${operador}','${despacho}')`;
//     db.executeSql(query);
//   });
// };

// export const guardarDestinos = (db: any, data: any, token: any, codigoOperador: any, despacho: any) => {
//   data.map(async (element) => {
//     let keys = Object.keys(element);
//     let values = JSON.stringify(Object.values(element));
//     let str = values.slice(1, values.length - 1);
//     const query = `INSERT INTO destinos (${keys}, token, codigoOperador, despacho) values (${str},'${token}', '${codigoOperador}', '${despacho}')`;
//     db.executeSql(query);
//   });
// };

// export const guardarDespachoNovedad = (db: any, data: any) => {
//   let keys = Object.keys(data);
//   let values = JSON.stringify(Object.values(data));
//   let str = values.slice(1, values.length - 1);
//   let query = `INSERT INTO despachoNovedad (${keys}) values (${str})`;
//   db.executeSql(query);
// };

// export const guardarGuiaImagen = (db: any, data: any) => {
//   let keys = Object.keys(data);
//   let values = JSON.stringify(Object.values(data));
//   let str = values.slice(1, values.length - 1);
//   let query = `INSERT INTO guiaImagenes (${keys}) values (${str})`;
//   db.executeSql(query);
// };

// export const eliminarNovedadesTipoPorCodigoOperador = (db: any, codigoOperador: any) => {
//   let query = `delete from novedadTipos where codigoOperador = '${codigoOperador}'`;
//   db.executeSql(query);
// };

// export const eliminarDespachos = (db: any, codigoDespacho: any, token: any, operador: any) => {
//   let query = `delete from despachos where token = '${token}' and codigoOperadorFk = '${operador}' and codigoDespacho = '${codigoDespacho}'`;
//   db.executeSql(query);
// };

// export const eliminarGuias = (db: any, codigoOperador: any, codigoDespacho: any, token: any) => {
//   let query = `delete from guias where token = '${token}' and operador = '${codigoOperador}' and despacho = '${codigoDespacho}' `;
//   db.executeSql(query);
// };

// export const eliminarDestinos = (db: any, despacho: any, token: any, operador: any) => {
//   let query = `delete from destinos where token = '${token}' and operador = '${operador}' and despacho = '${despacho}' and token = '${token}' `;
//   db.executeSql(query);
// };

// export const actualizarOperadorPorSincronizacion = (
//   db: any ,
//   codigoOperador: any,
//   data: any
// ) => {
//   const date = dayjs();
//   let exigeImagenEntrega = data.exigeImagenEntrega ? "1" : "0";
//   let exigeFirmaEntrega = data.exigeFirmaEntrega ? "1" : "0";
//   const query = `UPDATE operadores SET sincronizado = '1', fechaSincronizado = '${date.format(
//     "DD/MM/YYYY h:mm"
//   )}', calidadImagenEntrega = '${
//     data.calidadImagenEntrega
//   }', exigeImagenEntrega = '${exigeImagenEntrega}', exigeFirmaEntrega = '${exigeFirmaEntrega}'  WHERE codigoOperadorPk = '${codigoOperador}'`;
//   db.executeSql(query);
// };

// export const actualizarDespachoEstadoEntregado = (
//   db: any,
//   codigoOperador: any,
//   codigoDespacho: any,
//   token: any
// ) => {
//   const query = `UPDATE despachos SET estadoEntregado = '1' where token = '${token}' and codigoOperadorFk = '${codigoOperador}' and codigoDespacho = '${codigoDespacho}' `;
//   db.executeSql(query);
// };

// export const actualizarDespachoEstadoGestionGuias = (
//   db: any,
//   codigoOperador: any,
//   codigoDespacho: any,
//   token: any,
//   estadoGestionGuias: any
// ) => {
//   const query = `UPDATE despachos SET estadoGestionGuias = '${estadoGestionGuias}'  where token = '${token}' and codigoOperadorFk = '${codigoOperador}' and codigoDespacho = '${codigoDespacho}' `;
//   db.executeSql(query);
// };

// export const actualizarGuias = (db: any, data: any) => {
//   const date = dayjs();
//   const query = `UPDATE guias SET 
//     estadoEntregado = '1',
//     fechaEntrega = '${date.format("YYYY-MM-DDTHH:mm:ss")}',
//     usuarioEntrega = '${data.usuario}',
//     celular = '${data.celular}',
//     numeroIdentificacion= '${data.numeroIdentificacion}',
//     parentesco = '${data.parentesco}',
//     recibe = '${data.recibe}'
//     where 
//     codigoGuia = '${data.codigoGuia}' 
//     and token = '${data.token}'
//     and operador = '${data.operador}'
//     and despacho = '${data.codigoDespacho}' `;
//   db.executeSql(query);
// };

// export const actualizarGuiaEstadoNovedad = (db: any, codigoGuia: any) => {
//   const query = `UPDATE guias SET estadoNovedad = '1' where codigoGuia = '${codigoGuia}'`;
//   db.executeSql(query);
// };

// export const actualizarGuiaEstadoSincronizacion = (
//   db: any,
//   codigoGuia: any,
//   apiMensajeError: any
// ) => {
//   const query = `UPDATE guias SET estadoSincronizado = '1', sincronizadoError = '1', sincronizadoError = '${apiMensajeError}' where codigoGuia = '${codigoGuia}'`;
//   db.executeSql(query);
// };

// export async function initDataBase() {
//   const db = await getDbConeccion();
//   await crearTablaUsuarios(db);
//   await crearTablaDespachos(db);
//   await crearTablaDespachoNovedad(db);
//   await crearTablaGuia(db);
//   await crearTablaGuiaImagenes(db);
//   await crearTablaDestinos(db);
//   await crearTablaNovedadTipos(db);
//   await crearTablaOperador(db);
//   db.close;
// }
