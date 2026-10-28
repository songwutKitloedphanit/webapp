import { after, test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'

const server = await createServer({
  configFile: false,
  plugins: [react()],
  server: { middlewareMode: true },
  appType: 'custom',
})

after(async () => {
  await server.close()
})

const { default: AppRoutes } = await server.ssrLoadModule('/src/AppRoutes.jsx')
const { default: Home } = await server.ssrLoadModule('/src/pages/Home.jsx')
const { default: Users, UserList } = await server.ssrLoadModule('/src/pages/Users.jsx')
const { default: FoodList } = await server.ssrLoadModule('/src/FoodList.jsx')

const ann = { userId: 1, userName: 'Ann', email: 'ann@gmail.com', role: 'user' }
const john = { userId: 2, userName: 'John', email: 'john@gmail.com', role: 'admin' }
const cake = { menuId: 5, name: 'cake', price: 35, isBestSeller: true, avgRating: 3.5, ratingCount: 2 }
const bread = { menuId: 4, name: 'bread', price: 25, isBestSeller: false, avgRating: null, ratingCount: 0 }

function inRouter(element, path = '/') {
  return renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [path] }, element))
}

function renderRoute(path) {
  return inRouter(createElement(AppRoutes), path)
}

function renderPage(Page, user, path = '/') {
  const session = { status: 'ready', user, error: '' }
  return inRouter(createElement(Page, { session, onLogout: () => {}, onSessionExpired: () => {} }), path)
}

test('guest home shows the menu loader and a Login link but no member controls', () => {
  const html = renderRoute('/')
  assert.match(html, /Guest Mode/)
  assert.match(html, /href="\/login"/)
  assert.match(html, /กำลังโหลดเมนู/)
  assert.doesNotMatch(html, /Logout|<form|href="\/users"/)
})

test('login page has username and password fields and links to register', () => {
  const html = renderRoute('/login')
  assert.match(html, /<h1>Login<\/h1>/)
  assert.match(html, /name="userName"/)
  assert.match(html, /name="password"[^>]*type="password"|type="password"[^>]*name="password"/)
  assert.match(html, /href="\/register"/)
})

test('register page has the four fields from the mockup and links to login', () => {
  const html = renderRoute('/register')
  for (const field of ['userName', 'email', 'password', 'cpassword']) {
    assert.ok(html.includes('name="' + field + '"'), 'Missing ' + field + ' field')
  }
  assert.match(html, /Sign Up/)
  assert.match(html, /href="\/login"/)
})

test('user home shows the user name and Logout but no admin controls', () => {
  const html = renderPage(Home, ann)
  assert.match(html, /Ann/)
  assert.match(html, /Logout/)
  assert.match(html, /User Mode/)
  assert.doesNotMatch(html, /<form|href="\/users"|>Login</)
})

test('admin home links to user management and shows the add menu form', () => {
  const html = renderPage(Home, john)
  assert.match(html, /Admin Mode/)
  assert.match(html, /href="\/users"/)
  assert.match(html, /Add menu/)
  for (const field of ['name', 'price', 'isBestSeller']) {
    assert.ok(html.includes('name="' + field + '"'), 'Missing ' + field + ' field')
  }
})

test('users page renders nothing for non-admins because it redirects home', () => {
  assert.equal(renderPage(Users, ann, '/users'), '')
  assert.equal(renderPage(Users, null, '/users'), '')
})

test('admin users page shows the user heading and a link back to the menu', () => {
  const html = renderPage(Users, john, '/users')
  assert.match(html, /<h2>User<\/h2>/)
  assert.match(html, /href="\/"/)
})

test('menu items show the average rating, and guests get no rating or delete controls', () => {
  const html = renderToStaticMarkup(createElement(FoodList, { food: [cake, bread] }))
  assert.match(html, /⭐3.5/)
  assert.match(html, /⭐-/)
  assert.doesNotMatch(html, /<select|class="delete-button"/)
})

test('users get a rating picker that shows their saved score', () => {
  const html = renderToStaticMarkup(createElement(FoodList, {
    food: [cake, bread],
    canRate: true,
    myRatings: { 5: 4 },
    onRate: () => {},
  }))
  assert.equal(html.match(/Choose rating/g).length, 2)
  assert.match(html, /<option value="4" selected="">4<\/option>/)
  assert.doesNotMatch(html, /class="delete-button"/)
})

test('admins get Del buttons and no rating picker', () => {
  const html = renderToStaticMarkup(createElement(FoodList, { food: [cake], isAdmin: true }))
  assert.match(html, /class="delete-button"/)
  assert.doesNotMatch(html, /Choose rating/)
})

test('user list lets admins change other roles but not their own', () => {
  const html = renderToStaticMarkup(createElement(UserList, {
    users: [ann, john],
    currentUserId: john.userId,
    onRoleChange: () => {},
  }))
  assert.match(html, /ann@gmail.com/)
  assert.match(html, /aria-label="role ของ Ann"(?![^>]*disabled)/)
  assert.match(html, /aria-label="role ของ John"[^>]*disabled/)
})

test('empty food list displays an empty state without delete buttons', () => {
  const html = renderToStaticMarkup(createElement(FoodList, { food: [] }))
  assert.match(html, /ไม่มีรายการอาหารแล้ว/)
  assert.doesNotMatch(html, /<button/)
})

test('food names are rendered as text, not executable markup', () => {
  const html = renderToStaticMarkup(createElement(FoodList, {
    food: [{ ...bread, name: '<script>alert(1)</script>' }],
  }))
  assert.doesNotMatch(html, /<script>/)
  assert.match(html, /&lt;script&gt;/)
})
