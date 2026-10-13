import { after, test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const server = await createServer({
  configFile: false,
  plugins: [react()],
  server: { middlewareMode: true },
  appType: 'custom',
})

after(async () => {
  delete globalThis.window
  await server.close()
})

const { default: App } = await server.ssrLoadModule('/src/App.jsx')
const { default: FoodList } = await server.ssrLoadModule('/src/FoodList.jsx')

function renderPage(hash, savedMode = null) {
  globalThis.window = { location: { hash }, localStorage: { getItem: () => savedMode } }
  return renderToStaticMarkup(createElement(App))
}

test('home links only to the menu system', () => {
  const html = renderPage('')
  assert.match(html, /href="#menu"/)
  assert.doesNotMatch(html, /พื้นฐาน React|href="#basics"/)
  assert.doesNotMatch(html, /Count Down/)
})

test('menu route loads from the API and exposes fields required for menu records', () => {
  const html = renderPage('#menu', 'admin')
  for (const field of ['name', 'price', 'isBestSeller']) {
    assert.ok(html.includes('name="' + field + '"'), 'Missing ' + field + ' field')
  }
  assert.doesNotMatch(html, /ประเภทเมนู|name="typeId"/)
  assert.match(html, /กำลังโหลดเมนู/)
  assert.doesNotMatch(html, /cake|bread|milk|donut|cookie/)
  assert.match(html, /Add menu/)
  assert.doesNotMatch(html, /href="#home"|กลับหน้าเลือกงาน/)
  assert.doesNotMatch(html, /Count Up/)
})

test('user mode hides menu mutation controls and the food form', () => {
  const html = renderPage('#menu', 'user')
  assert.match(html, /User Mode/)
  assert.doesNotMatch(html, /class="delete-button"/)
  assert.doesNotMatch(html, /class="edit-button"/)
  assert.doesNotMatch(html, /<form/)
})

test('missing or invalid saved mode defaults to user mode', () => {
  for (const savedMode of [null, '', 'invalid']) {
    assert.match(renderPage('#menu', savedMode), /User Mode/)
  }
})

test('storage read failure displays its cause and keeps the menu available', () => {
  globalThis.window = {
    location: { hash: '#menu' },
    localStorage: { getItem: () => { throw new Error('Storage blocked') } },
  }
  const html = renderToStaticMarkup(createElement(App))
  assert.match(html, /role="alert"/)
  assert.match(html, /Storage blocked/)
  assert.match(html, /User Mode/)
  assert.match(html, /กำลังโหลดเมนู/)
})

test('unknown routes fall back to the index page', () => {
  const html = renderPage('#unknown')
  assert.match(html, /href="#menu"/)
})

test('empty food list displays an empty state without delete buttons', () => {
  const html = renderToStaticMarkup(createElement(FoodList, { food: [], deleteItem: () => {} }))
  assert.match(html, /ไม่มีรายการอาหารแล้ว/)
  assert.doesNotMatch(html, /<button/)
})

test('food names are rendered as text, not executable markup', () => {
  const html = renderToStaticMarkup(createElement(FoodList, {
    food: [{ menuId: 1, name: '<script>alert(1)</script>', price: 35, isBestSeller: false }],
    deleteItem: () => {},
  }))
  assert.doesNotMatch(html, /<script>/)
  assert.match(html, /&lt;script&gt;/)
})
