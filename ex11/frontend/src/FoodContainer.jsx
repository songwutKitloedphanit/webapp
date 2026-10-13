import { useEffect, useState } from 'react'
import { createMenu, deleteMenu, getMenus, getTypes, updateMenu } from './menuApi'
import FoodList from './FoodList'
import FoodForm from './FoodForm'

function FoodContainer() {
  const [food, setFood] = useState([])
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [preferences, setPreferences] = useState(() => {
    try {
      const savedMode = window.localStorage.getItem('foodMode')
      return { mode: savedMode === 'admin' ? 'admin' : 'user', error: '' }
    } catch (error) {
      return { mode: 'user', error: `อ่าน mode ที่บันทึกไว้ไม่ได้: ${error.message}` }
    }
  })
  const isAdmin = preferences.mode === 'admin'

  useEffect(() => {
    let isMounted = true

    async function loadMenu() {
      try {
        const [menuItems, menuTypes] = await Promise.all([getMenus(), getTypes()])
        if (isMounted) {
          setFood(menuItems)
          setTypes(menuTypes)
        }
      } catch (loadError) {
        if (isMounted) setError('โหลดเมนูไม่สำเร็จ: ' + loadError.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadMenu()
    return () => {
      isMounted = false
    }
  }, [])

  const changeMode = () => {
    const nextMode = isAdmin ? 'user' : 'admin'
    try {
      window.localStorage.setItem('foodMode', nextMode)
      setPreferences({ mode: nextMode, error: '' })
    } catch (error) {
      setPreferences({ mode: nextMode, error: `บันทึก mode ไม่ได้: ${error.message}` })
    }
  }

  const saveItem = async (item) => {
    if (!isAdmin) return false
    const isEditing = Boolean(editingItem)
    setError('')
    setIsSaving(true)

    try {
      if (editingItem) {
        const updatedItem = await updateMenu(editingItem.menuId, item)
        setFood((currentFood) => currentFood.map((currentItem) => (
          currentItem.menuId === updatedItem.menuId ? updatedItem : currentItem
        )))
        setEditingItem(null)
      } else {
        const newItem = await createMenu(item)
        setFood((currentFood) => [newItem, ...currentFood])
      }
      return true
    } catch (saveError) {
      setError((isEditing ? 'แก้ไข' : 'เพิ่ม') + 'เมนูไม่สำเร็จ: ' + saveError.message)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const removeItem = async (menuId) => {
    if (!isAdmin) return
    setError('')
    setIsSaving(true)

    try {
      await deleteMenu(menuId)
      setFood((currentFood) => currentFood.filter((item) => item.menuId !== menuId))
      if (editingItem?.menuId === menuId) setEditingItem(null)
    } catch (deleteError) {
      setError('ลบเมนูไม่สำเร็จ: ' + deleteError.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="exercise">
      <div className="mode-controls">
        <strong>{isAdmin ? 'Admin Mode' : 'User Mode'}</strong>
        <button type="button" onClick={changeMode}>{isAdmin ? 'User' : 'Admin'}</button>
      </div>
      {preferences.error && <p className="form-error" role="alert">{preferences.error}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="menu-heading">
        <h2>Our Menu</h2>
        <span>{food.length} รายการ</span>
      </div>
      {loading ? (
        <p aria-live="polite">กำลังโหลดเมนู...</p>
      ) : (
        <FoodList
          food={food}
          onDelete={removeItem}
          onEdit={setEditingItem}
          isAdmin={isAdmin}
          disabled={isSaving}
        />
      )}
      {isAdmin && (
        <FoodForm
          key={editingItem?.menuId || 'new'}
          saveItem={saveItem}
          defaultTypeId={types[0]?.typeId}
          editingItem={editingItem}
          onCancel={() => setEditingItem(null)}
          isSaving={isSaving}
        />
      )}
    </section>
  )
}

export default FoodContainer
