import { Route, Routes } from 'react-router-dom'
import './App.css'
import BattlePicker from '../components/battlePicker'
import BattlePage from './pages/BattlePage';

function App() {
  return (
    <>
      <BattlePicker/>
      <Routes>
        <Route path="/battle" element={<BattlePage />}/>
      </Routes>
    </>
  )
}

export default App
