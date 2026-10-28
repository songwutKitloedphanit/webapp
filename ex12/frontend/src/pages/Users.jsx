import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { getUsers, updateUserRole } from '../authApi'
import TopBar from '../TopBar'

export function UserList({ users, currentUserId, onRoleChange, disabled }) {
  return (
    <ul className="user-list">
      {users.map((user) => (
        <li key={user.userId}>
          <span className="food-name">{user.userName}</span>
          <span className="user-email">{user.email}</span>
          <select
            aria-label={'role ของ ' + user.userName}
            value={user.role}
            onChange={(event) => onRoleChange(user.userId, event.target.value)}
            disabled={disabled || user.userId === currentUserId}
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          {user.userId === currentUserId && <span className="menu-note">(คุณ)</span>}
        </li>
      ))}
    </ul>
  )
}

function UserManager({ currentUserId, onSessionExpired }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    getUsers()
      .then((items) => {
        if (isMounted) setUsers(items)
      })
      .catch((loadError) => {
        if (!isMounted) return
        if (loadError.status === 401) onSessionExpired()
        else setError('โหลดรายชื่อผู้ใช้ไม่สำเร็จ: ' + loadError.message)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [onSessionExpired])

  const changeRole = async (userId, role) => {
    setError('')
    setIsSaving(true)
    try {
      const updatedUser = await updateUserRole(userId, role)
      setUsers((currentUsers) => currentUsers.map((user) => (
        user.userId === updatedUser.userId ? updatedUser : user
      )))
    } catch (saveError) {
      if (saveError.status === 401) onSessionExpired()
      else setError('เปลี่ยน role ไม่สำเร็จ: ' + saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="exercise">
      <div className="menu-heading">
        <h2>User</h2>
        <span>{users.length} คน</span>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {loading ? (
        <p aria-live="polite">กำลังโหลดรายชื่อผู้ใช้...</p>
      ) : (
        <UserList users={users} currentUserId={currentUserId} onRoleChange={changeRole} disabled={isSaving} />
      )}
    </section>
  )
}

function Users({ session, onLogout, onSessionExpired }) {
  if (session.status === 'checking') {
    return <p className="app-shell" aria-live="polite">กำลังตรวจสอบการ login...</p>
  }
  if (session.user?.role !== 'admin') return <Navigate to="/" replace />

  return (
    <div className="app-shell">
      <TopBar session={session} onLogout={onLogout} />
      <nav className="page-nav">
        <Link className="nav-button" to="/">menu</Link>
      </nav>
      <main>
        <UserManager currentUserId={session.user.userId} onSessionExpired={onSessionExpired} />
      </main>
    </div>
  )
}

export default Users
