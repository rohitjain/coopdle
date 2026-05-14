import { HashRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Solver from './pages/Solver'
import Instructor from './pages/Instructor'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/solver/:gameId" element={<Solver />} />
        <Route path="/instructor/:gameId" element={<Instructor />} />
      </Routes>
    </HashRouter>
  )
}
