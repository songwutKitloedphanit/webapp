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

test('home links to both exercise sections', () => {
  const html = renderPage('')
  assert.match(html, /href="#basics"/)
  assert.match(html, /href="#menu"/)
  assert.doesNotMatch(html, /Count Down/)
})

test('basics route renders all three exercises and a home link', () => {
  const html = renderPage('#basics')
  for (const expected of ['Go Red', 'Hello world', 'type="color"', 'Count Up', 'Count Down', 'href="#home"']) {
    assert.ok(html.includes(expected), `Missing ${expected}`)
  }
  assert.doesNotMatch(html, /Our Menu/)
})

test('menu route renders all five foods and deletion controls', () => {
  const html = renderPage('#menu', 'admin')
  for (const name of ['cake', 'bread', 'milk', 'donut', 'cookie']) {
    assert.ok(html.includes(`aria-label="ลบ ${name}"`), `Missing delete control for ${name}`)
  }
  assert.equal((html.match(/class="bestseller"/g) || []).length, 3)
  assert.match(html, /Add menu/)
  assert.match(html, /name="price"/)
  assert.doesNotMatch(html, /Count Up/)
})

test('user mode hides deletion controls and the food form', () => {
  const html = renderPage('#menu', 'user')
  assert.match(html, /User Mode/)
  assert.doesNotMatch(html, /class="delete-button"/)
  assert.doesNotMatch(html, /<form/)
  assert.match(html, /cake/)
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
  assert.match(html, /cake/)
})

test('unknown routes fall back to the index page', () => {
  assert.match(renderPage('#unknown'), /href="#basics"/)
})

test('empty food list displays an empty state without delete buttons', () => {
  const html = renderToStaticMarkup(createElement(FoodList, { food: [], deleteItem: () => {} }))
  assert.match(html, /ไม่มีรายการอาหารแล้ว/)
  assert.doesNotMatch(html, /<button/)
})

test('food names are rendered as text, not executable markup', () => {
  const html = renderToStaticMarkup(createElement(FoodList, {
    food: [{ name: '<script>alert(1)</script>', price: 35, isBestSeller: false }],
    deleteItem: () => {},
  }))
  assert.doesNotMatch(html, /<script>/)
  assert.match(html, /&lt;script&gt;/)
})
