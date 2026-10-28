const scores = [5, 4, 3, 2, 1]

const FoodItem = ({ item, onDelete, onEdit, onRate, myRating, isAdmin, canRate, disabled }) => {
  return (
    <li className="food-item">
      <div className="food-details">
        <span className="food-name">{item.name}</span>
        <span className="food-rating" title={item.ratingCount + ' คนให้คะแนน'}>
          (⭐{item.avgRating ?? '-'} )
        </span>
        {item.isBestSeller && <span className="bestseller">🏅 BestSeller</span>}
      </div>
      <span className="food-price">{item.price} baht</span>
      {canRate && (
        <label className="rating-picker">
          Choose rating:
          <select
            name="rating"
            value={myRating ?? ''}
            onChange={(event) => onRate(item.menuId, Number(event.target.value))}
            disabled={disabled}
          >
            {myRating === undefined && <option value="" disabled>-</option>}
            {scores.map((score) => <option key={score} value={score}>{score}</option>)}
          </select>
        </label>
      )}
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
