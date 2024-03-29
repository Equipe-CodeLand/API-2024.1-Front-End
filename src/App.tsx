import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RouteAtivos from './pages/ativosPage';
import RouteHome from './pages/homePage';
import RouteManutecao from './pages/manutencaoPage';

import "./styles/global.css";
import RouteManutecaoCadastro from './pages/manutencaoCadastroPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<RouteHome />} />
        <Route path='/ativos' element={<RouteAtivos />} />
        <Route path="/manutencao" element={<RouteManutecao />} />
        <Route path="/manutencaoCadastro" element={<RouteManutecaoCadastro />} />
      </Routes>
    </Router>
  );
}

export default App;
