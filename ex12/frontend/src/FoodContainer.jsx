import { useEffect, useState } from 'react'
import { createMenu, deleteMenu, getMenus, getMyRatings, getTypes, rateMenu, updateMenu } from './menuApi'
import FoodList from './FoodList'
import FoodForm from './FoodForm'

const POLL_INTERVAL_MS = 5000

function toRatingMap(ratings) {
  return Object.fromEntries(ratings.map((rating) => [rating.menuId, rating.score]))
}

function FoodContainer({ user, onSessionExpired }) {
  const [food, setFood] = useState([])
  const [types, setTypes] = useState([])
  const [myRatings, setMyRatings] = useState({})
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const isAdmin = user?.role === 'admin'
  const canRate = user?.role === 'user'
  const modeLabel = isAdmin ? 'Admin Mode' : canRate ? 'User Mode' : 'Guest Mode'

  useEffect(() => {
    let isMounted = true

    async function loadMenu() {
      try {
        const [menuItems, ratings] = await Promise.all([
          getMenus(),
          canRate ? getMyRatings() : [],
        ])
        if (isMounted) {
          setFood(menuItems)
          setMyRatings(toRatingMap(ratings))
          setLoadError('')
        }
      } catch (fetchError) {
        if (!isMounted) return
        if (fetchError.status === 401) onSessionExpired()
        else setLoadError('โหลดเมนูไม่สำเร็จ: ' + fetchError.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadMenu()
    const intervalId = setInterval(loadMenu, POLL_INTERVAL_MS)
    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [canRate, onSessionExpired])

  useEffect(() => {
    if (!isAdmin) return
    let isMounted = true
    getTypes()
      .then((menuTypes) => {
        if (isMounted) setTypes(menuTypes)
      })
      .catch((typeError) => {
        if (isMounted) setError('โหลดประเภทเมนูไม่สำเร็จ: ' + typeError.message)
      })
    return () => {
      isMounted = false
    }
  }, [isAdmin])

  const reportError = (prefix, actionError) => {
    if (actionError.status === 401) onSessionExpired()
    else setError(prefix + actionError.message)
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
      reportError((isEditing ? 'แก้ไข' : 'เพิ่ม') + 'เมนูไม่สำเร็จ: ', saveError)
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
      reportError('ลบเมนูไม่สำเร็จ: ', deleteError)
    } finally {
      setIsSaving(false)
    }
  }

  const rateItem = async (menuId, score) => {
    if (!canRate) return
    setError('')
    setIsSaving(true)

    try {
      await rateMenu(menuId, score)
      setMyRatings((currentRatings) => ({ ...currentRatings, [menuId]: score }))
      setFood(await getMenus())
    } catch (rateError) {
      reportError('ให้คะแนนไม่สำเร็จ: ', rateError)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="exercise">
      <p className="mode-label">{modeLabel}</p>
      {loadError && <p className="form-error" role="alert">{loadError}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="menu-heading">
        <h2>Our Menu</h2>
        <span>{food.length} รายการ · อัปเดตทุก 5 วินาที</span>
      </div>
      {loading ? (
        <p aria-live="polite">กำลังโหลดเมนู...</p>
      ) : (
        <FoodList
          food={food}
          onDelete={removeItem}
          onEdit={setEditingItem}
          onRate={rateItem}
          myRatings={myRatings}
          isAdmin={isAdmin}
          canRate={canRate}
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
