import FoodItem from './FoodItem'

const FoodList = ({ food, deleteItem, isAdmin }) => {
  return (
    <div>
      {food.length === 0 && <p>ไม่มีรายการอาหารแล้ว</p>}
      <ul className="food-list">
        {food.map((item, index) => (
          <FoodItem key={index} item={item} index={index} deleteItem={deleteItem} isAdmin={isAdmin} />
        ))}
      </ul>
    </div>
  )
}

export default FoodList
