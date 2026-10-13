import FoodItem from './FoodItem'

const FoodList = ({ food, onDelete, onEdit, isAdmin, disabled }) => {
  return (
    <div>
      {food.length === 0 && <p>ไม่มีรายการอาหารแล้ว</p>}
      <ul className="food-list">
        {food.map((item) => (
          <FoodItem
            key={item.menuId}
            item={item}
            onDelete={onDelete}
            onEdit={onEdit}
            isAdmin={isAdmin}
            disabled={disabled}
          />
        ))}
      </ul>
    </div>
  )
}

export default FoodList
