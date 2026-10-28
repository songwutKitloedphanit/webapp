import { useState } from 'react'

function FoodForm({ saveItem, defaultTypeId, editingItem, onCancel, isSaving }) {
  const [inputs, setInputs] = useState(() => ({
    name: editingItem?.name || '',
    price: editingItem ? String(editingItem.price) : '',
    isBestSeller: editingItem ? String(editingItem.isBestSeller) : 'true',
  }))
  const [error, setError] = useState('')

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    setInputs(values => ({ ...values, [name]: value }))
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const price = Number(inputs.price)
    // Types load after the form mounts, so read the default when the form is submitted.
    const typeId = editingItem?.typeId ?? defaultTypeId

    if (typeId === undefined) {
      setError('ยังโหลดประเภทเมนูไม่ได้ หรือ backend ยังไม่มีประเภทเมนู (ตาราง type)')
      return
    }
    if (
      inputs.name.trim() === ''
      || inputs.price.trim() === ''
      || !Number.isFinite(price)
      || price < 0
    ) {
      setError('กรุณากรอกชื่ออาหารและราคาให้ถูกต้อง')
      return
    }

    const menu = {
      name: inputs.name.trim(),
      price,
      isBestSeller: inputs.isBestSeller === 'true',
      typeId,
    }
    const saved = await saveItem(menu)
    if (saved && !editingItem) {
      setInputs({ name: '', price: '', isBestSeller: 'true' })
      setError('')
    }
  }

  return (
    <form className="food-form" onSubmit={handleSubmit}>
      <h2>{editingItem ? 'Edit Food' : 'New Food'}</h2>
      <label>
        ชื่ออาหาร
        <input type="text" name="name" value={inputs.name} onChange={handleChange} maxLength="150" required disabled={isSaving} />
      </label>
      <label>
        ราคา
        <input type="number" name="price" value={inputs.price} onChange={handleChange} min="0" step="0.01" required disabled={isSaving} />
      </label>
      <label>
        Best Seller
        <select name="isBestSeller" value={inputs.isBestSeller} onChange={handleChange} disabled={isSaving}>
          <option value="true">BestSeller</option>
          <option value="false">Normal</option>
        </select>
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : editingItem ? 'Save changes' : 'Add menu'}
      </button>
      {editingItem && (
        <button type="button" onClick={onCancel} disabled={isSaving}>Cancel</button>
      )}
    </form>
  )
}

export default FoodForm
