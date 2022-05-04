// let reloj = 0;

// const eventos = {
//   inicializacion: {
//     name: 'inicializacion',
//   },
//   llegadaCliente: {
//     name: 'llegadaCliente',
//     inicio: 16,
//     fin: 24,
//     reloj: null,
//   },
//   llenarFormulario: {
//     name: 'llenarFormulario',
//     inicio: 100,
//     fin: 140,
//     reloj: null,
//   },
//   revisarFormulario: {
//     name: 'revisarFormulario',
//     inicio: 16,
//     fin: 20,
//     reloj: null,
//   },
//   corregirFormulario: {
//     name: 'corregirFormulario',
//     inicio: 50,
//     fin: 70,
//     reloj: null,
//   },
// };

// const formularios = [];

// const porcentajeError = 0.1;

// const cantidadClientes = 10;

// let eventoActual = 'inicializacion';
// let proximoEvento = '';

// // FUNCIONES

// function probabilidadUniforme(a, b, rnd) {
//   return a + (b - a) * rnd;
// }

// function determinarProximoEvento(eventoActual, rnd) {
//   let proximoEvento = [];
//   if (eventoActual === eventos.inicializacion.name) {
//     proximoEvento.push(eventos.llegadaCliente.name);
//   } else if (eventoActual === eventos.llegadaCliente.name) {
//     proximoEvento.push(eventos.llegadaCliente.name);
//     proximoEvento.push(eventos.llenarFormulario.name);
//     // rnd para el segundo evento (llenar formulario)
//     let rnd2 = Math.random();
//   } else if (eventoActual === eventos.llenarFormulario.name) {
//     proximoEvento.push(eventos.revisarFormulario.name);
//   } else if (eventoActual === eventos.revisarFormulario.name) {
//     const error = 0.08;
//     if (error < 0.1) {
//       proximoEvento.push(eventos.corregirFormulario.name);
//     }
//   }

//   const inicio = eventos[proximoEvento].inicio;
//   const fin = eventos[proximoEvento].fin;
//   const proximoReloj = reloj + probabilidadUniforme(inicio, fin, rnd);

//   return [proximoEvento[0], proximoReloj];
// }

// function generarNuevaFila(eventoActual, reloj) {
//   // Determinar Proximo evento
//   let rnd = Math.random();
//   const [proximoEvento, proximoReloj] = determinarProximoEvento(
//     eventoActual,
//     rnd
//   );

//   // Crear Elementos
//   const nuevaFila = document.createElement('tr');
//   const celdaEvento = document.createElement('td');
//   const celdaReloj = document.createElement('td');
//   const celdaRndLlegadaCliente = document.createElement('td');
//   const celdaProxLlegadaCliente = document.createElement('td');

//   // Insertar data
//   celdaEvento.innerHTML = eventoActual;
//   celdaReloj.innerHTML = reloj;
//   celdaRndLlegadaCliente.innerHTML = rnd;
//   celdaProxLlegadaCliente.innerHTML = proximoReloj;

//   // append child
//   nuevaFila.appendChild(celdaEvento);
//   nuevaFila.appendChild(celdaReloj);
//   nuevaFila.appendChild(celdaRndLlegadaCliente);
//   nuevaFila.appendChild(celdaProxLlegadaCliente);

//   document.getElementById('tableBody').appendChild(nuevaFila);
// }

// function main() {
//   for (let i = 0; i < 1; i++) {}
// }

// main();

///////////////////////////////////

const llegadaClienteTiempoA = 16;
const llegadaClienteTiempoB = 24;
const llenarFormularioTiempoA = 100;
const llenarFormularioTiempoB = 140;
const revisarFormularioTiempoA = 16;
const revisarFormularioTiempoB = 20;
const corregirFormularioTiempoA = 50;
const corregirFormularioTiempoB = 70;

const tableBody = document.getElementById('tablaSimulacion');

// FUNCIONES

function cabeceraTabla() {
  let cabecera = `<tr>
                      <th>Reloj</th>
                      <th>Evento</th>
                      <th>RND cliente</th>
                      <th>Próximo cliente</th>
                      <th>RND llenar form</th>
                      <th>Fin llenar form</th>
                      <th>RND revisar form</th>
                      <th>Fin revisar form</th>
                      <th>RND cometió errores</th>
                      <th>Cometió errores</th>
                      <th>RND corregir form</th>
                      <th>Fin corregir form</th>
                      <th>ESTADO Empleado</th>
                      <th>COLA Empleado</th>
                      <th>Cant máxima en cola</th>
                  </tr>`;

  return cabecera;
}

function rellenarTabla(elem, cabecera, tabla) {
  elem.innerHTML = cabecera;
  for (let i = 0; i < tabla.length; i++) {
    let cadena = `<tr>`;
    for (let j = 0; j < tabla[i].length; j++) {
      cadena += `<td>${tabla[i][j]}</td>`;
    }
    cadena += `</tr>`;
    elem.innerHTML += cadena;
  }
  return elem;
}

function crearRandoms(cantidadClientes) {
  let arrayRandoms = [];
  for (let i = 0; i < 5; i++) {
    let insert = [];
    for (let j = 0; j < cantidadClientes * 2; j++) {
      let rnd = Number(Math.random().toFixed(2));
      insert.push(rnd);
    }
    arrayRandoms.push(insert);
  }
  return arrayRandoms;
}

function borrarRandoms(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].splice(0, 1);
  }
  return arr;
}

function actualizarReloj(tiempos) {
  let arr = [];
  for (let i = 0; i < tiempos.length; i++) {
    if (!isNaN(tiempos[i])) {
      arr.push(tiempos[i]);
    }
  }
  let menor = Math.min.apply(null, arr);
  return menor;
}

function actualizarEvento(tiempos, reloj, nroCliente) {
  let proximoEvento;
  if (reloj === 0) {
    proximoEvento = 'Inicialización';
  } else if (reloj === tiempos[0]) {
    proximoEvento = 'Llegada cliente';
  } else if (reloj === tiempos[1]) {
    proximoEvento = 'Fin llenar formulario';
  } else if (reloj === tiempos[2]) {
    proximoEvento = 'Fin revisar formulario';
  } else if (reloj === tiempos[3]) {
    proximoEvento = 'Fin corregir formulario';
  }

  return `${proximoEvento}`;
}

function probabilidadUniforme(a, b, rnd) {
  return a + (b - a) * rnd;
}

function ordernarArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1; j++) {
      if (arr[j][1] > arr[j + 1][1]) {
        let aux = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = aux;
      }
    }
  }
  return arr;
}

function menorFinLlenarFormulario(
  arrayFinLlenarFormulario,
  finLlenarFormulario
) {
  let menorTiempoProximo;
  if (arrayFinLlenarFormulario.length <= 1) {
    menorTiempoProximo = finLlenarFormulario;
  } else {
    let arrayOrdenado = ordernarArray(arrayFinLlenarFormulario);
    menorTiempoProximo = arrayOrdenado[0][1];
  }

  // arrayFinLlenarFormulario.push([
  //   `Formulario ${formulariosCreados}`,
  //   finLlenarFormulario,
  // ]);
  console.log('ArrayFin', arrayFinLlenarFormulario);
  return menorTiempoProximo;
}

class Empleado {
  constructor(estado, cola) {
    this.estado = estado;
    this.cola = cola;
  }
}

function simular(cantidadClientes, segundoDesde, segundoHasta) {
  let randoms = crearRandoms(cantidadClientes);
  let tablaTotal = [];
  let tablaParcial = [new Array(15).fill(0), new Array(15).fill(0)];
  let reloj = 0;
  let evento = 'Inicialización';
  let rndCliente = randoms[0][0];
  let proximoCliente = 0;
  let rndLlenarFormulario = '-';
  let finLlenarFormulario = '-';
  let rndRevisarFormulario = '-';
  let finRevisarFormulario = '-';
  let rndCometioErrores = '-';
  let cometioErrores = '-';
  let rndCorregirFormulario = '-';
  let finCorregirFormulario = '-';
  let estadoEmpleado = 'libre';
  let colaEmpleado = 0;

  let arrayTiempos = [
    proximoCliente,
    finLlenarFormulario,
    finRevisarFormulario,
    finCorregirFormulario,
  ];

  let formulariosCreados = 0;
  let colaMaxima = 0;

  let empleado = new Empleado(estadoEmpleado, colaEmpleado);

  let arrayFormularios = [];
  let arrayFinLlenarFormulario = [];
  let arrayEmpleados = [empleado];

  while (formulariosCreados < 8) {
    console.log(arrayTiempos);
    reloj = actualizarReloj(arrayTiempos);
    evento = actualizarEvento(arrayTiempos, reloj, formulariosCreados);
    console.log(`RELOJ: ${reloj}`);

    rndCliente = randoms[0][0];
    rndLlenarFormulario = randoms[1][0];

    if (reloj === 0) {
      let tiempoEntreLlegadas = probabilidadUniforme(
        llegadaClienteTiempoA,
        llegadaClienteTiempoB,
        rndCliente
      );
      proximoCliente = Number((reloj + tiempoEntreLlegadas).toFixed(2));
    }

    if (reloj === proximoCliente) {
      let tiempoEntreLlegadas = probabilidadUniforme(
        llegadaClienteTiempoA,
        llegadaClienteTiempoB,
        rndCliente
      );
      proximoCliente = Number((reloj + tiempoEntreLlegadas).toFixed(2));

      formulariosCreados++;
      let tiempoLlenarFormulario = probabilidadUniforme(
        llenarFormularioTiempoA,
        llenarFormularioTiempoB,
        rndLlenarFormulario
      );
      finLlenarFormulario = Number((reloj + tiempoLlenarFormulario).toFixed(2));

      arrayFinLlenarFormulario.push([
        `Formulario ${formulariosCreados}`,
        finLlenarFormulario,
      ]);
    }

    randoms = borrarRandoms(randoms);

    arrayTiempos = [
      proximoCliente,
      finLlenarFormulario,
      finRevisarFormulario,
      finCorregirFormulario,
    ];

    let filaTabla = [
      reloj,
      evento,
      rndCliente,
      proximoCliente,
      rndLlenarFormulario,
      finLlenarFormulario,
      rndRevisarFormulario,
      finRevisarFormulario,
      rndCometioErrores,
      cometioErrores,
      rndCorregirFormulario,
      finCorregirFormulario,
      estadoEmpleado,
      colaEmpleado,
      colaMaxima,
    ];
    console.log('PROX finLlenarFormulario', finLlenarFormulario);
    finLlenarFormulario = menorFinLlenarFormulario(
      arrayFinLlenarFormulario,
      finLlenarFormulario
    );

    tablaParcial.splice(0, 1);
    tablaParcial.push(filaTabla);
    // console.log(tablaParcial);

    tablaTotal.push(filaTabla);
    console.log(evento);
    console.log('-----------------------');
  }
  console.log('TABLA TOTAL:', tablaTotal);
  return tablaTotal;
}

function obtenerCantidadClientes() {
  let cantidadClientes = document.getElementById('selectorClientes').value;

  return 5; //////////////
}

function obtenerDesdeHasta() {
  let minutoDesde = Number(document.getElementById('inputDesde').value);
  let minutoHasta = Number(document.getElementById('inputHasta').value);

  return [minutoDesde, minutoHasta];
}

function main() {
  let cantidadClientes = obtenerCantidadClientes();
  let segundoDesde = obtenerDesdeHasta()[0];
  let segundoHasta = obtenerDesdeHasta()[1];

  let tabla = simular(cantidadClientes, segundoDesde, segundoHasta);
  let cabecera = cabeceraTabla();
  rellenarTabla(tableBody, cabecera, tabla);
}

function initButtons() {
  document.getElementById('btnSimular').addEventListener('click', () => {
    main();
  });
}

initButtons();
