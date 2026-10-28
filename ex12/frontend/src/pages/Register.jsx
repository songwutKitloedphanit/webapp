import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../authApi'

const emptyInputs = { userName: '', email: '', password: '', cpassword: '' }

function Register() {
  const navigate = useNavigate()
  const [inputs, setInputs] = useState(emptyInputs)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setInputs(values => ({ ...values, [name]: value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (inputs.password !== inputs.cpassword) {
      setError('Password mismatch')
      return
    }

    setIsSubmitting(true)
    try {
      const { userName, email, password } = inputs
      const data = await register({ userName, email, password })
      navigate('/login', { state: { message: data.message + ' กรุณา login' } })
    } catch (registerError) {
      setError(registerError.message)
      setInputs(values => ({ ...values, password: '', cpassword: '' }))
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Register</h1>
        <div className="auth-body">
          <input type="text" name="userName" placeholder="Username" autoComplete="username" value={inputs.userName} onChange={handleChange} minLength="3" maxLength="50" pattern="[A-Za-z0-9_.\-]+" title="ใช้ตัวอักษรอังกฤษ ตัวเลข จุด ขีด หรือขีดล่าง 3-50 ตัว" required disabled={isSubmitting} />
          <input type="email" name="email" placeholder="Email" autoComplete="email" value={inputs.email} onChange={handleChange} maxLength="255" required disabled={isSubmitting} />
          <input type="password" name="password" placeholder="Password" autoComplete="new-password" value={inputs.password} onChange={handleChange} minLength="8" required disabled={isSubmitting} />
          <input type="password" name="cpassword" placeholder="Confirm Password" autoComplete="new-password" value={inputs.cpassword} onChange={handleChange} minLength="8" required disabled={isSubmitting} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'กำลังสมัคร...' : 'Sign Up'}
          </button>
          <p className="auth-switch">
            Have an Account ? <Link to="/login">Login Here</Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Register
