import http from 'k6/http';
import { check, sleep } from 'k6';

// ============================================================
// Fase 4: Pruebas de Carga y Estrés con k6
// ============================================================

// Configuración de los escenarios
export const options = {
  stages: [
    { duration: '1m', target: 50 }, // Ramping up a 50 VUs
    { duration: '2m', target: 50 }, // Meseta de estabilización
    { duration: '1m', target: 0 },  // Ramping down a 0
  ],
  // Umbrales de éxito (globales)
  thresholds: {
    http_req_duration: ['p(90)<800', 'p(95)<1200'],
    http_req_failed: ['rate<0.01'],
    // Umbrales específicos por endpoint 
    'http_req_duration{endpoint:precio}': ['p(95)<800'],
    'http_req_duration{endpoint:disponibilidad}': ['p(95)<800'],
    'http_req_duration{endpoint:reserva}': ['p(95)<1500'],
  },
};


const BASE_URL = 'https://cabanapinohuacho.mlarac.cl';

export default function () {
  // 1. Endpoint: Precio
  let resPrecio = http.get(`${BASE_URL}/api/precio`, {
    tags: { endpoint: 'precio' },
  });
  check(resPrecio, {
    'Precio - status es 200': (r) => r.status === 200,
    'Precio - contiene propiedad price': (r) => {
      try {
        return r.json().hasOwnProperty('price');
      } catch (e) {
        return false;
      }
    },
  });
  sleep(1);

  // 2. Endpoint: Disponibilidad
  let resDispo = http.get(`${BASE_URL}/api/availability/2026/07`, {
    tags: { endpoint: 'disponibilidad' },
  });
  check(resDispo, {
    'Disponibilidad - status es 200': (r) => r.status === 200,
    'Disponibilidad - es un objeto': (r) => {
      try {
        const body = r.json();
        return typeof body === 'object' && !Array.isArray(body);
      } catch (e) {
        return false;
      }
    },
  });
  sleep(1);

  // 3. Endpoint: Reserva (POST application/x-www-form-urlencoded)
  const payloadReserva = {
    guestName: 'Renato Escárate',
    guestEmail: 'rescaratef@gmail.com',
    guestPhone: '+56990042992',
    checkIn: '2026-08-05',
    checkOut: '2026-08-10',
    guests: '2',
    notes: 'Llegaremos tarde por la noche',
  };

  const paramsReserva = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    tags: { endpoint: 'reserva' },
  };

  let resReserva = http.post(
    `${BASE_URL}/reservar`,
    payloadReserva,
    paramsReserva
  );
  check(resReserva, {
    'Reserva - status es exitoso (200, 201 o 302)': (r) =>
      [200, 201, 302].includes(r.status),
    'Reserva - es HTML': (r) =>
      r.headers['Content-Type'] &&
      r.headers['Content-Type'].includes('text/html'),
  });

  sleep(2);
}

// ============================================================
// Cómo ejecutarlo:
//   k6 run load-test.js
//
// Para guardar el resumen en un archivo
//   k6 run load-test.js --summary-export=resumen.json
//