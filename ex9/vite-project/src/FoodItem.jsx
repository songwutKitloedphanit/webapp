const FoodItem = ({ item, index, deleteItem, isAdmin }) => {
  return (
    <li className="food-item">
      <div className="food-details">
        <span className="food-name">{item.name}</span>
        {item.isBestSeller && <span className="bestseller">🏅 BestSeller</span>}
      </div>
      <span className="food-price">{item.price} baht</span>
      {isAdmin && (
        <button
          className="delete-button"
          type="button"
          aria-label={`ลบ ${item.name}`}
          onClick={() => deleteItem(index)}
        >Del</button>
      )}
    </li>
  )
}

export default FoodItem
