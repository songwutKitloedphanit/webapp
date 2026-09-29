import { useState } from 'react'

function TextColor() {
  const [text, setText] = useState('Hello world')
  const [color, setColor] = useState('#ff0080')

  function handleTextChange(event) {
    setText(event.target.value)
  }

  function handleColorChange(event) {
    setColor(event.target.value)
  }

  return (
    <section className="exercise">
      <div className="exercise-heading">
        <span className="step-number">02</span>
        <div>
          <h2>เปลี่ยนข้อความและสี</h2>
        </div>
      </div>
      <div className="demo-area text-preview">
        <p style={{ color: color }}>{text}</p>
      </div>
      <div className="input-row">
        <label className="text-field">
          ข้อความ
          <input type="text" value={text} onChange={handleTextChange} />
        </label>
        <label className="color-field">
          สีข้อความ
          <input type="color" value={color} onChange={handleColorChange} />
        </label>
      </div>
    </section>
  )
}

export default TextColor
