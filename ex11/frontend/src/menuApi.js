async function request(path, options) {
  const response = await fetch(path, options)
  if (response.status === 204) return null

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    throw new Error(data?.error || 'API request failed with status ' + response.status + '.')
  }
  if (!isJson) throw new Error('API response was not JSON.')

  return data
}

export function getMenus() {
  return request('/api/menu')
}

export function getTypes() {
  return request('/api/type')
}

export function createMenu(menu) {
  return request('/api/menu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(menu),
  })
}

export function updateMenu(menuId, menu) {
  return request('/api/menu/' + menuId, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(menu),
  })
}

export function deleteMenu(menuId) {
  return request('/api/menu/' + menuId, { method: 'DELETE' })
}
