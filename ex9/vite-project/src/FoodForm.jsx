import { useState } from 'react'

function FoodForm({ addItem }) {
  const [inputs, setInputs] = useState({ name: '', price: '', isBestSeller: 'true' })
  const [error, setError] = useState('')

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    setInputs(values => ({ ...values, [name]: value }))
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    const price = Number(inputs.price)

    if (inputs.name.trim() === '' || inputs.price.trim() === '' || !Number.isFinite(price)) {
      setError('กรุณากรอกชื่ออาหารและราคาที่เป็นตัวเลข')
      return
    }

    const newFood = {
      name: inputs.name.trim(),
      price: price,
      isBestSeller: inputs.isBestSeller === 'true',
    }
    addItem(newFood)
    setInputs({ name: '', price: '', isBestSeller: 'true' })
    setError('')
  }

  return (
    <form className="food-form" onSubmit={handleSubmit}>
      <h2>New Food</h2>
      <label>
        ชื่ออาหาร
        <input type="text" name="name" value={inputs.name} onChange={handleChange} required />
      </label>
      <label>
        ราคา
        <input type="number" name="price" value={inputs.price} onChange={handleChange} step="any" required />
      </label>
      <label>
        Best Seller
        <select name="isBestSeller" value={inputs.isBestSeller} onChange={handleChange}>
          <option value="true">BestSeller</option>
          <option value="false">Normal</option>
        </select>
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit">Add menu</button>
    </form>
  )
}

export default FoodForm
