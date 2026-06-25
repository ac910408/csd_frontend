/**
 * Cliente HTTP centralizado con fetch nativo.
 * Interceptor 401 → redirect login.
 * Interceptor errores → throw objeto { codigo, mensaje, detalles }.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

/** Callback para redirect en caso de 401. Se configura desde router. */
let onSessionExpired = () => {
  window.location.href = '/auth/login'
}

async function request(method, path, body) {
  const token = localStorage.getItem('csd-token')

  const headers = {
    'Content-Type': 'application/json',
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  // Interceptor 401: sesión expirada
  if (res.status === 401) {
    localStorage.removeItem('csd-token')
    onSessionExpired()
    throw { codigo: 'SESSION_EXPIRED', mensaje: 'Sesión expirada' }
  }

  const json = await res.json()

  if (!res.ok) {
    const err = json.error || { codigo: 'UNKNOWN', mensaje: 'Error desconocido' }
    throw err
  }

  return json
}

export function setSessionExpiredHandler(fn) {
  onSessionExpired = fn
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  del: (path) => request('DELETE', path),
}
