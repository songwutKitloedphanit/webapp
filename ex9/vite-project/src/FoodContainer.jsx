import { useState } from 'react'
import FoodList from './FoodList'
import FoodForm from './FoodForm'

function FoodContainer() {
  const [food, setFood] = useState([
    { name: 'cake', price: 35, isBestSeller: true },
    { name: 'bread', price: 25, isBestSeller: false },
    { name: 'milk', price: 15, isBestSeller: true },
    { name: 'donut', price: 45, isBestSeller: false },
    { name: 'cookie', price: 55, isBestSeller: true },
  ])
  const [preferences, setPreferences] = useState(() => {
    try {
      const savedMode = window.localStorage.getItem('foodMode')
      return { mode: savedMode === 'admin' ? 'admin' : 'user', error: '' }
    } catch (error) {
      return { mode: 'user', error: `อ่าน mode ที่บันทึกไว้ไม่ได้: ${error.message}` }
    }
  })
  const isAdmin = preferences.mode === 'admin'

  const changeMode = () => {
    const nextMode = isAdmin ? 'user' : 'admin'
    try {
      window.localStorage.setItem('foodMode', nextMode)
      setPreferences({ mode: nextMode, error: '' })
    } catch (error) {
      setPreferences({ mode: nextMode, error: `บันทึก mode ไม่ได้: ${error.message}` })
    }
  }

  const deleteItem = (index) => {
    if (!isAdmin) return
    const result = food.filter((item, i) => i !== index)
    setFood(result)
  }

  const addItem = (item) => {
    if (!isAdmin) return
    const result = [...food, item]
    setFood(result)
  }

  return (
    <section className="exercise">
      <div className="mode-controls">
        <strong>{isAdmin ? 'Admin Mode' : 'User Mode'}</strong>
        <button type="button" onClick={changeMode}>{isAdmin ? 'User' : 'Admin'}</button>
      </div>
      {preferences.error && <p className="form-error" role="alert">{preferences.error}</p>}
      <div className="menu-heading">
        <h2>Our Menu</h2>
        <span>{food.length} รายการ</span>
      </div>
      <FoodList food={food} deleteItem={deleteItem} isAdmin={isAdmin} />
      {isAdmin && <FoodForm addItem={addItem} />}
    </section>
  )
}

export default FoodContainer
