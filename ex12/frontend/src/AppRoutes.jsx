import { useCallback, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { clearToken, getToken, saveToken } from './apiClient'
import { getCurrentUser } from './authApi'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Users from './pages/Users'

function readInitialSession() {
  try {
    return { status: getToken() ? 'checking' : 'ready', user: null, error: '' }
  } catch (error) {
    return { status: 'ready', user: null, error: 'อ่าน token ที่บันทึกไว้ไม่ได้: ' + error.message }
  }
}

function AppRoutes() {
  const navigate = useNavigate()
  const [session, setSession] = useState(readInitialSession)

  const endSession = useCallback((message = '') => {
    let error = message
    try {
      clearToken()
    } catch (storageError) {
      error = 'ลบ token ไม่ได้: ' + storageError.message
    }
    setSession({ status: 'ready', user: null, error })
  }, [])

  const expireSession = useCallback(() => {
    endSession('Session หมดอายุ กรุณา login ใหม่')
  }, [endSession])

  useEffect(() => {
    if (session.status !== 'checking') return
    let isMounted = true

    getCurrentUser()
      .then((user) => {
        if (isMounted) setSession({ status: 'ready', user, error: '' })
      })
      .catch((error) => {
        if (!isMounted) return
        if (error.status === 401) {
          expireSession()
        } else {
          setSession({ status: 'ready', user: null, error: 'ตรวจสอบการ login ไม่สำเร็จ: ' + error.message })
        }
      })

    return () => {
      isMounted = false
    }
  }, [session.status, expireSession])

  const handleLogin = async (token) => {
    saveToken(token)
    const user = await getCurrentUser()
    setSession({ status: 'ready', user, error: '' })
    navigate('/')
  }

  const handleLogout = () => {
    endSession()
    navigate('/login')
  }

  const pageProps = { session, onLogout: handleLogout, onSessionExpired: expireSession }

  return (
    <Routes>
      <Route path="/" element={<Home {...pageProps} />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/users" element={<Users {...pageProps} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
