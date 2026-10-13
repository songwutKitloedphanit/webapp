import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  function handleCountUp() {
    setCount(previous => previous + 1)
  }

  function handleCountDown() {
    setCount(previous => previous - 1)
  }

  return (
    <section className="exercise">
      <div className="exercise-heading">
        <span className="step-number">03</span>
        <div>
          <h2>ตัวนับเลข</h2>
        </div>
      </div>
      <div className="demo-area counter-demo">
        <p className="count-value" aria-live="polite">{count}</p>
        <div className="button-row">
          <button className="secondary-button" type="button" onClick={handleCountDown}>Count Down</button>
          <button type="button" onClick={handleCountUp}>Count Up</button>
        </div>
      </div>
    </section>
  )
}

export default Counter
