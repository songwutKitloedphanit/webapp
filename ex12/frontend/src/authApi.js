import { request, sendJson } from './apiClient.js'

export function register(user) {
  return sendJson('/api/authen/register', 'POST', user)
}

export function login(credentials) {
  return sendJson('/api/authen/login', 'POST', credentials)
}

export async function getCurrentUser() {
  const data = await request('/api/authen/home')
  return data.user
}

export function getUsers() {
  return request('/api/users')
}

export function updateUserRole(userId, role) {
  return sendJson('/api/users/' + userId + '/role', 'PATCH', { role })
}
