// import React from 'react';
// import database from '@react-native-firebase/database';
// import messaging from '@react-native-firebase/messaging';
// import {Platform} from 'react-native';
// import {fechaActual} from '../funciones';
// import { useDispatch } from 'react-redux';

// export const crearRegistroFireBase = async (codigoUsuario, token) => {
//   const reference = database().ref(`/session/${codigoUsuario}`).set({
//     os: Platform.OS,
//     activo: true,
//     fechaAutenticacion: `${fechaActual().fecha} ${fechaActual().hora}`,
//     token
//   });
// };

// export const consultarSessionFireBase = async (codigoUsuario, setData) => {
//   const data = await database()
//     .ref(`/session/${codigoUsuario}`)
//     .on('value', snapshot => setData(snapshot.val()));
// };

// export const consultarRegistrosFireBase = async codigoUsuario => {
//   // const consultaFireBase = await database()
//   //   .ref(`/session/${codigoUsuario}`)
//   //   .once('value');
//   // const informacionFirebase = await consultaFireBase._snapshot.value;
//   // return informacionFirebase;
// };


// export const actualizarRegistroFireBase = (codigoUsuario, data) => {
//   const reference = database().ref(`/session/${codigoUsuario}`).update(data);
// };

// export const obtenerTokenFirebase = async () => {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     const fireBaseToken = await messaging().getToken();
//     return fireBaseToken;
//   } else {
//     return false;
//   }
// };
