import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { login } from '../authApi'

function Login({ onLogin }) {
  const location = useLocation()
  const [inputs, setInputs] = useState({ userName: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const notice = location.state?.message

  function handleChange(event) {
    const { name, value } = event.target
    setInputs(values => ({ ...values, [name]: value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      const data = await login(inputs)
      await onLogin(data.token)
    } catch (loginError) {
      setError(loginError.message)
      setInputs(values => ({ ...values, password: '' }))
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="auth-body">
          {notice && <p className="form-notice" role="status">{notice}</p>}
          <input type="text" name="userName" placeholder="Username" autoComplete="username" value={inputs.userName} onChange={handleChange} required disabled={isSubmitting} />
          <input type="password" name="password" placeholder="Password" autoComplete="current-password" value={inputs.password} onChange={handleChange} required disabled={isSubmitting} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'Login'}
          </button>
          <p className="auth-switch">
            No Account ? <Link to="/register">Register Here</Link>
          </p>
          <p className="auth-switch"><Link to="/">ดูเมนูแบบ Guest</Link></p>
        </div>
      </form>
    </div>
  )
}

export default Login
