import { request, sendJson } from './apiClient.js'

export function getMenus() {
  return request('/api/menu')
}

export function getTypes() {
  return request('/api/type')
}

export function createMenu(menu) {
  return sendJson('/api/menu', 'POST', menu)
}

export function updateMenu(menuId, menu) {
  return sendJson('/api/menu/' + menuId, 'PATCH', menu)
}

export function deleteMenu(menuId) {
  return request('/api/menu/' + menuId, { method: 'DELETE' })
}

export function getMyRatings() {
  return request('/api/rating/me')
}

export function rateMenu(menuId, score) {
  return sendJson('/api/rating/' + menuId, 'PUT', { score })
}
