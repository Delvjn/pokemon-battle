import { useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import BattlePage from './pages/BattlePage';
import LandingPage from './pages/landingPage';

function App() {
  const [yourPokemon, setYourPokemon] = useState(null)
  const [opponentPokemon, setOpponentPokemon] = useState(null)
  const navigate = useNavigate()

  function handleBattleStart(yours, opponent) {
    setYourPokemon(yours)
    setOpponentPokemon(opponent)
    navigate('/battle')
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              onBattleStart={handleBattleStart}
            />
          }
        />
        <Route
          path="/battle"
          element={
            <BattlePage
              yourPokemon={yourPokemon}
              opponentPokemon={opponentPokemon}
            />
          }
        />
      </Routes>
    </>
  )
}

export default App
