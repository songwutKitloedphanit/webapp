import { useEffect, useState } from 'react'
import Index from './Index'
import Basics from './Basics'
import FoodContainer from './FoodContainer'
import './App.css'

function App() {
  const [page, setPage] = useState(() => window.location.hash)

  useEffect(() => {
    function handleNavigation() {
      setPage(window.location.hash)
      window.scrollTo(0, 0)
    }

    window.addEventListener('hashchange', handleNavigation)
    return () => window.removeEventListener('hashchange', handleNavigation)
  }, [])

  const isBasics = page === '#basics'
  const isMenu = page === '#menu'

  return (
    <div className="app-shell">
      <main>
        {isBasics || isMenu ? (
          <>
            <a className="link-button" href="#home">← กลับหน้าเลือกงาน</a>
            {isBasics ? <Basics /> : <FoodContainer />}
          </>
        ) : <Index />}
      </main>

    </div>
  )
}

export default App
