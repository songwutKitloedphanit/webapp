import { useState } from 'react'
import TextColor from './TextColor'
import Counter from './Counter'

function Basics() {
  const [isRed, setIsRed] = useState(false)

  function handleClick() {
    setIsRed(previous => !previous)
  }

  return (
    <div className="exercise-stack">
      <section className="exercise">
        <div className="exercise-heading">
          <span className="step-number">01</span>
          <div>
            <h2>เปลี่ยนสีปุ่ม</h2>
            </div>
        </div>
        <div className="demo-area">
          <button
            type="button"
            onClick={handleClick}
            style={{ backgroundColor: isRed ? 'red' : 'blue', color: 'white' }}
          >
            {isRed ? 'Go Blue' : 'Go Red'}
          </button>
        </div>
      </section>
      <TextColor />
      <Counter />
    </div>
  )
}

export default Basics
