import { Link } from 'react-router-dom'
import FoodContainer from '../FoodContainer'
import TopBar from '../TopBar'

function Home({ session, onLogout, onSessionExpired }) {
  const isAdmin = session.user?.role === 'admin'

  return (
    <div className="app-shell">
      <TopBar session={session} onLogout={onLogout} />
      {isAdmin && (
        <nav className="page-nav">
          <Link className="nav-button" to="/users">user</Link>
        </nav>
      )}
      <main>
        <FoodContainer user={session.user} onSessionExpired={onSessionExpired} />
      </main>
    </div>
  )
}

export default Home
