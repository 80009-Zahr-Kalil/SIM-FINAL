const llegadaClienteTiempoA = 16;
const llegadaClienteTiempoB = 24;
const llenarFormularioTiempoA = 100;
const llenarFormularioTiempoB = 140;
const revisarFormularioTiempoA = 16;
const revisarFormularioTiempoB = 20;
const corregirFormularioTiempoA = 50;
const corregirFormularioTiempoB = 70;

const tableBody = document.getElementById('tablaSimulacion');

const probabilidadError = 0.1;

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

function ordernarArray(arr, reloj) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1; j++) {
      if (arr[j][1] > arr[j + 1][1]) {
        let aux = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = aux;
      }
    }
  }

  let pos = 0;
  while (arr[pos][1] <= reloj) {
    arr.push(arr[pos]);
    arr.shift();
  }

  return arr;
}

function menorFinLlenarFormulario(
  arrayFinLlenarFormulario,
  finLlenarFormulario,
  reloj
) {
  let menorTiempoProximo;
  if (arrayFinLlenarFormulario.length <= 1) {
    menorTiempoProximo = finLlenarFormulario;
  } else {
    let arrayOrdenado = ordernarArray(arrayFinLlenarFormulario, reloj);
    menorTiempoProximo = arrayOrdenado[0][1];
  }

  return menorTiempoProximo;
}

function menorFinCorregirFormulario(
  arrayFinCorregirFormulario,
  finCorregirFormulario,
  reloj
) {
  let menorTiempoProximo;
  if (arrayFinCorregirFormulario.length <= 1) {
    menorTiempoProximo = finCorregirFormulario;
  } else {
    menorTiempoProximo = arrayFinCorregirFormulario[0][1];
  }

  return menorTiempoProximo;
}

// function determinarProxFinCorrefirFormulario(arrayFinCorregirFormulario) {
//   if (arrayFinCorregirFormulario.length <= 1) {
//     return '-';
//   }
// }

function verificarServidores(empleado) {
  if (empleado.estado === 'libre') {
    empleado.estado = 'ocupado';
  } else {
    empleado.cola++;
  }

  return empleado;
}

function decrementarCola(empleado) {
  if (empleado.cola > 0) {
    empleado.cola--;
  } else {
    empleado.estado = 'libre';
  }

  return empleado;
}

function hayFormulariosEsperandoRevision(arrayFormularios) {
  for (let i = 0; i < arrayFormularios.length; i++) {
    if (arrayFormularios[i].estado === 'ER') return true;
  }
  return false;
}

function actualizarEstadoFormulario(
  arrayFormularios,
  reloj,
  nuevoEstado,
  nuevoFinEstado
) {
  for (let i = 0; i < arrayFormularios.length; i++) {
    if (reloj === arrayFormularios[i].finEstado) {
      arrayFormularios[i].estado = nuevoEstado;
      arrayFormularios[i].finEstado = nuevoFinEstado;
      break;
    }
  }

  return arrayFormularios;
}

function actualizarEspRevisionASiendoRev(arrayFormularios, nuevoFinEstado) {
  for (let i = 0; i < arrayFormularios.length; i++) {
    if (arrayFormularios[i].estado === 'ER') {
      arrayFormularios[i].estado = 'SR';
      arrayFormularios[i].finEstado = nuevoFinEstado;
    }
    break;
  }

  return arrayFormularios;
}

function actualizarSiendoRevASiendoCorregido(arrayFormularios, nuevoFinEstado) {
  for (let i = 0; i < arrayFormularios.length; i++) {
    if (arrayFormularios[i].estado === 'SR') {
      arrayFormularios[i].estado = 'SC';
      arrayFormularios[i].finEstado = nuevoFinEstado;
    }
    break;
  }

  return arrayFormularios;
}

function verificarSiCometioErrores(rnd, probError) {
  if (rnd < probError) return true;
  return false;
}

function eliminarFormularioFinalizado(arrayFormularios, reloj) {
  for (let i = 0; i < arrayFormularios.length; i++) {
    if (reloj === arrayFormularios[i].finEstado) {
      arrayFormularios.shift();
      break;
    }
  }

  return arrayFormularios;
}

function determinarMaximaCola(colaAnterior, colaActual) {
  if (colaActual > colaAnterior) return colaActual;
  return colaAnterior;
}

class Empleado {
  constructor(estado, cola) {
    this.estado = estado;
    this.cola = cola;
  }
}

class Formulario {
  constructor(estado, finEstado) {
    this.estado = estado;
    this.finEstado = finEstado;
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
  let formulariosFinalizados = 0;
  let colaMaxima = 0;

  let empleado = new Empleado(estadoEmpleado, colaEmpleado);

  let arrayFormularios = [];
  let arrayFinLlenarFormulario = [];
  let arrayFinCorregirFormulario = [];

  let X = 0;
  while (X < cantidadClientes) {
    console.log(formulariosFinalizados);
    console.log('Array finCorregirFormulario', arrayFinCorregirFormulario);
    reloj = actualizarReloj(arrayTiempos);
    evento = actualizarEvento(arrayTiempos, reloj, formulariosCreados);

    // Evento = Inicialización
    if (reloj === 0) {
      rndCliente = randoms[0][0];

      let tiempoEntreLlegadas = probabilidadUniforme(
        llegadaClienteTiempoA,
        llegadaClienteTiempoB,
        rndCliente
      );
      proximoCliente = Number((reloj + tiempoEntreLlegadas).toFixed(2));
    }

    // Evento = Llegada cliente
    if (reloj === proximoCliente) {
      rndRevisarFormulario = '-';
      rndCliente = randoms[0][0];
      rndLlenarFormulario = randoms[1][0];
      rndCometioErrores = '-';
      cometioErrores = '-';
      rndCorregirFormulario = '-';

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

      arrayFormularios.push(new Formulario('SL', finLlenarFormulario));

      arrayFinLlenarFormulario.push([
        `Formulario ${formulariosCreados}`,
        finLlenarFormulario,
      ]);
    }

    // Evento = Fin llenar formulario
    if (reloj === finLlenarFormulario) {
      rndCliente = '-';
      rndLlenarFormulario = '-';
      finLlenarFormulario = arrayFinLlenarFormulario[1][1];
      rndCometioErrores = '-';
      cometioErrores = '-';
      rndCorregirFormulario = '-';

      if (estadoEmpleado === 'libre') {
        rndRevisarFormulario = randoms[2][0];
        let tiempoRevisarFormulario = probabilidadUniforme(
          revisarFormularioTiempoA,
          revisarFormularioTiempoB,
          rndRevisarFormulario
        );
        finRevisarFormulario = Number(
          (reloj + tiempoRevisarFormulario).toFixed(2)
        );
        arrayFormularios = actualizarEstadoFormulario(
          arrayFormularios,
          reloj,
          'SR',
          finRevisarFormulario
        );
      } else {
        rndRevisarFormulario = '-';
        arrayFormularios = actualizarEstadoFormulario(
          arrayFormularios,
          reloj,
          'ER',
          '-'
        );
      }

      let empleadoActualizado = verificarServidores(empleado);
      estadoEmpleado = empleadoActualizado.estado;
      colaEmpleado = empleadoActualizado.cola;
    }

    // Evento = Fin revisar formulario
    if (reloj === finRevisarFormulario) {
      rndCliente = '-';
      rndLlenarFormulario = '-';

      formulariosFinalizados++;

      rndCometioErrores = randoms[3][0];
      if (verificarSiCometioErrores(rndCometioErrores, probabilidadError)) {
        cometioErrores = 'SI';
        rndCorregirFormulario = randoms[4][0];
        let tiempoCorregirFormulario = probabilidadUniforme(
          corregirFormularioTiempoA,
          corregirFormularioTiempoB,
          rndCorregirFormulario
        );
        finCorregirFormulario = Number(
          (reloj + tiempoCorregirFormulario).toFixed(2)
        );

        arrayFormularios = actualizarSiendoRevASiendoCorregido(
          arrayFormularios,
          finCorregirFormulario
        );

        arrayFinCorregirFormulario.push([
          `Formulario ${formulariosCreados}`,
          finCorregirFormulario,
        ]);
      } else {
        cometioErrores = 'NO';
        arrayFormularios = eliminarFormularioFinalizado(
          arrayFormularios,
          reloj
        );
        // formulariosFinalizados++;
      }

      let empleadoActualizado = decrementarCola(empleado);
      estadoEmpleado = empleadoActualizado.estado;
      colaEmpleado = empleadoActualizado.cola;

      if (hayFormulariosEsperandoRevision(arrayFormularios)) {
        rndRevisarFormulario = randoms[2][0];
        let tiempoRevisarFormulario = probabilidadUniforme(
          revisarFormularioTiempoA,
          revisarFormularioTiempoB,
          rndRevisarFormulario
        );
        finRevisarFormulario = Number(
          (reloj + tiempoRevisarFormulario).toFixed(2)
        );
        console.log('ACTUALIZAR A SIENDO REV');
        arrayFormularios = actualizarEspRevisionASiendoRev(
          arrayFormularios,
          finRevisarFormulario
        );
      } else {
        if (estadoEmpleado === 'libre') {
          finRevisarFormulario = '-';
        }
      }
    }

    // Evento = Fin corregir formulario
    if (reloj === finCorregirFormulario) {
      rndCliente = '-';
      rndLlenarFormulario = '-';
      rndCometioErrores = '-';
      cometioErrores = '-';
      finCorregirFormulario = '-';

      if (estadoEmpleado === 'libre') {
        rndRevisarFormulario = randoms[2][0];
        let tiempoRevisarFormulario = probabilidadUniforme(
          revisarFormularioTiempoA,
          revisarFormularioTiempoB,
          rndRevisarFormulario
        );
        finRevisarFormulario = Number(
          (reloj + tiempoRevisarFormulario).toFixed(2)
        );
        arrayFormularios = actualizarEstadoFormulario(
          arrayFormularios,
          reloj,
          'SR',
          finRevisarFormulario
        );
      } else {
        rndRevisarFormulario = '-';
        arrayFormularios = actualizarEstadoFormulario(
          arrayFormularios,
          reloj,
          'ER',
          '-'
        );
      }

      let empleadoActualizado = verificarServidores(empleado);
      estadoEmpleado = empleadoActualizado.estado;
      colaEmpleado = empleadoActualizado.cola;
    }

    randoms = borrarRandoms(randoms);
    colaMaxima = determinarMaximaCola(colaMaxima, colaEmpleado);

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

    finLlenarFormulario = menorFinLlenarFormulario(
      arrayFinLlenarFormulario,
      finLlenarFormulario,
      reloj
    );

    // finCorregirFormulario = menorFinCorregirFormulario(
    //   arrayFinCorregirFormulario,
    //   finCorregirFormulario,
    //   reloj
    // );

    arrayTiempos = [
      proximoCliente,
      finLlenarFormulario,
      finRevisarFormulario,
      finCorregirFormulario,
    ];

    console.log(`RELOJ: ${reloj}`);
    console.log('EVENTO:', evento);
    console.log('ArrTiempos:', arrayTiempos);
    // console.log('proximoCliente:', proximoCliente);
    // console.log('Array finCorregirFormulario', arrayFinCorregirFormulario);
    // console.log('finLlenarFormulario:', finLlenarFormulario);
    // console.log('finRevisarFormulario:', finRevisarFormulario);
    console.log('finCorregirFormulario:', finCorregirFormulario);
    console.log('ESTADO', estadoEmpleado);
    console.log('Array Formularios', arrayFormularios);

    tablaParcial.splice(0, 1);
    tablaParcial.push(filaTabla);

    if (reloj >= segundoDesde && reloj <= segundoHasta) {
      tablaTotal.push(filaTabla);
    }

    console.log('-------------------------------');
    X++;
  }
  console.log('TABLA TOTAL:', tablaTotal);
  return tablaTotal;
}

function obtenerCantidadClientes() {
  let cantidadClientes = document.getElementById('selectorClientes').value;

  return cantidadClientes;
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
