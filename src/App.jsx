import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Agendamento from './pages/Agendamento';
import EmissaoCarteirinha from './pages/EmissaoCarteirinha';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/carteirinha" element={<EmissaoCarteirinha />} />
      </Routes>
    </Router>
  );
}

export default App;