import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import PythagorasCalculator from './pages/PythagorasCalculator'
import CircleChordCalculator from './pages/CircleChordCalculator'
import RuleOfThree from './pages/RuleOfThree'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pythagoras" element={<PythagorasCalculator />} />
        <Route path="/circle-chord" element={<CircleChordCalculator />} />
        <Route path="/rule-of-three" element={<RuleOfThree />} />
      </Route>
    </Routes>
  )
}

export default App
