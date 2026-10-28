import { Link } from 'react-router-dom'

function TopBar({ session, onLogout }) {
  const { status, user, error } = session

  return (
    <>
      <header className="top-bar">
        {status === 'checking' && <span aria-live="polite">กำลังตรวจสอบการ login...</span>}
        {status === 'ready' && !user && <Link className="link-button" to="/login">Login</Link>}
        {user && (
          <>
            <span className="user-name">
              {user.userName}
              {user.role === 'admin' && <span className="role-badge">admin</span>}
            </span>
            <button type="button" onClick={onLogout}>Logout</button>
          </>
        )}
      </header>
      {error && <p className="form-error" role="alert">{error}</p>}
    </>
  )
}

export default TopBar
