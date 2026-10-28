import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getCurrentUser, login, register, updateUserRole } from './authApi.js'
import { createMenu, deleteMenu, getMenus, getTypes, rateMenu, updateMenu } from './menuApi.js'

function mockFetch(t, implementation) {
  const originalFetch = globalThis.fetch
  globalThis.fetch = implementation
  t.after(() => {
    globalThis.fetch = originalFetch
  })
}

function mockToken(t, token) {
  const store = new Map(token ? [['token', token]] : [])
  globalThis.window = {
    localStorage: {
      getItem: (key) => store.get(key) ?? null,
      setItem: (key, value) => store.set(key, value),
      removeItem: (key) => store.delete(key),
    },
  }
  t.after(() => {
    delete globalThis.window
  })
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

test('getMenus and getTypes read the backend endpoints without a token for guests', async (t) => {
  const calls = []
  mockFetch(t, async (path, options) => {
    calls.push({ path, authorization: options.headers.Authorization })
    return jsonResponse([])
  })

  assert.deepEqual(await getMenus(), [])
  assert.deepEqual(await getTypes(), [])
  assert.deepEqual(calls, [
    { path: '/api/menu', authorization: undefined },
    { path: '/api/type', authorization: undefined },
  ])
})

test('a saved token is sent as a Bearer Authorization header', async (t) => {
  mockToken(t, 'abc.def.ghi')
  let authorization
  mockFetch(t, async (_path, options) => {
    authorization = options.headers.Authorization
    return jsonResponse({ user: { userId: 1, userName: 'ann', role: 'user' } })
  })

  assert.deepEqual(await getCurrentUser(), { userId: 1, userName: 'ann', role: 'user' })
  assert.equal(authorization, 'Bearer abc.def.ghi')
})

test('menu, rating, auth, and role calls use the matching backend methods and IDs', async (t) => {
  const calls = []
  mockFetch(t, async (path, options = {}) => {
    calls.push({ path, method: options.method || 'GET', body: options.body })
    if (options.method === 'DELETE') return new Response(null, { status: 204 })
    return jsonResponse({})
  })

  const menu = { name: 'Soup', price: 30, isBestSeller: false, typeId: 2 }
  await createMenu(menu)
  await updateMenu(7, menu)
  await deleteMenu(7)
  await rateMenu(7, 4)
  await register({ userName: 'ann', email: 'ann@gmail.com', password: 'password123' })
  await login({ userName: 'ann', password: 'password123' })
  await updateUserRole(3, 'admin')

  assert.deepEqual(calls, [
    { path: '/api/menu', method: 'POST', body: JSON.stringify(menu) },
    { path: '/api/menu/7', method: 'PATCH', body: JSON.stringify(menu) },
    { path: '/api/menu/7', method: 'DELETE', body: undefined },
    { path: '/api/rating/7', method: 'PUT', body: '{"score":4}' },
    { path: '/api/authen/register', method: 'POST', body: '{"userName":"ann","email":"ann@gmail.com","password":"password123"}' },
    { path: '/api/authen/login', method: 'POST', body: '{"userName":"ann","password":"password123"}' },
    { path: '/api/users/3/role', method: 'PATCH', body: '{"role":"admin"}' },
  ])
})

test('backend error messages and status codes are surfaced to the caller', async (t) => {
  mockFetch(t, async () => jsonResponse({ error: 'Duplicate Username or Email' }, 409))

  await assert.rejects(
    register({ userName: 'ann', email: 'ann@gmail.com', password: 'password123' }),
    { message: 'Duplicate Username or Email', status: 409 },
  )
})
