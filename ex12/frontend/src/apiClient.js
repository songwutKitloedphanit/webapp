const TOKEN_KEY = 'token'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export function getToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function saveToken(token) {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY)
}

export async function request(path, options = {}) {
  const token = getToken()
  const headers = { ...options.headers }
  if (token) headers.Authorization = 'Bearer ' + token

  const response = await fetch(path, { ...options, headers })
  if (response.status === 204) return null

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    throw new ApiError(data?.error || 'API request failed with status ' + response.status + '.', response.status)
  }
  if (!isJson) throw new ApiError('API response was not JSON.', response.status)

  return data
}

export function sendJson(path, method, body) {
  return request(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
