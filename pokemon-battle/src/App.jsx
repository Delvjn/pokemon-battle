import { Route, Routes } from 'react-router-dom'
import './App.css'
import BattlePage from './pages/battlePage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/battle" element={<BattlePage />}/>
      </Routes>
    </>
  )
}

export default App
