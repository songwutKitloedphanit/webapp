import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createMenu, deleteMenu, getMenus, getTypes, updateMenu } from './menuApi.js'

function mockFetch(t, implementation) {
  const originalFetch = globalThis.fetch
  globalThis.fetch = implementation
  t.after(() => {
    globalThis.fetch = originalFetch
  })
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

test('getMenus and getTypes read the backend endpoints', async (t) => {
  const paths = []
  mockFetch(t, async (path) => {
    paths.push(path)
    return jsonResponse([])
  })

  assert.deepEqual(await getMenus(), [])
  assert.deepEqual(await getTypes(), [])
  assert.deepEqual(paths, ['/api/menu', '/api/type'])
})

test('create, update, and delete use the matching backend methods and menu IDs', async (t) => {
  const calls = []
  mockFetch(t, async (path, options = {}) => {
    calls.push({ path, method: options.method || 'GET', body: options.body })
    if (options.method === 'DELETE') return new Response(null, { status: 204 })
    return jsonResponse({ menuId: 7 })
  })

  const menu = { name: 'Soup', price: 30, isBestSeller: false, typeId: 2 }
  await createMenu(menu)
  await updateMenu(7, menu)
  await deleteMenu(7)

  assert.deepEqual(calls, [
    { path: '/api/menu', method: 'POST', body: JSON.stringify(menu) },
    { path: '/api/menu/7', method: 'PATCH', body: JSON.stringify(menu) },
    { path: '/api/menu/7', method: 'DELETE', body: undefined },
  ])
})

test('backend error messages are surfaced to the caller', async (t) => {
  mockFetch(t, async () => jsonResponse({ error: 'Menu item not found.' }, 404))

  await assert.rejects(getMenus(), { message: 'Menu item not found.' })
})
