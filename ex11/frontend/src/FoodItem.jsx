const FoodItem = ({ item, onDelete, onEdit, isAdmin, disabled }) => {
  return (
    <li className="food-item">
      <div className="food-details">
        <span className="food-name">{item.name}</span>
        {item.isBestSeller && <span className="bestseller">🏅 BestSeller</span>}
      </div>
      <span className="food-price">{item.price} baht</span>
      {isAdmin && (
        <div className="food-actions">
          <button
            className="edit-button"
            type="button"
            aria-label={'แก้ไข ' + item.name}
            onClick={() => onEdit(item)}
            disabled={disabled}
          >Edit</button>
          <button
            className="delete-button"
            type="button"
            aria-label={'ลบ ' + item.name}
            onClick={() => onDelete(item.menuId)}
            disabled={disabled}
          >Del</button>
        </div>
      )}
    </li>
  )
}

export default FoodItem
