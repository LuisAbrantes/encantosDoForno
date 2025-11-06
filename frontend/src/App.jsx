import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Cardapio from './pages/Cardapio';
import Agendamento from './pages/Agendamento';
import Fila from './pages/Fila';
import './App.css';

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="grow">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/cardapio" element={<Cardapio />} />
                        <Route path="/agendamento" element={<Agendamento />} />
                        <Route path="/fila" element={<Fila />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
