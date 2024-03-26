import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AtivosPage from './pages/ativosPage';
import HomePage from './pages/homePage';
import ManutencaoPage from './pages/manutencaoPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/ativos' element={<AtivosPage />} />
        <Route path="/manutencao" element={<ManutencaoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
