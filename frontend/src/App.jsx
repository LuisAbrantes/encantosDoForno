import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Cardapio from './pages/Cardapio';
import Agendamento from './pages/Agendamento';
import Fila from './pages/Fila';
// Admin pages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductsAdmin from './pages/admin/ProductsAdmin';
import ClassesAdmin from './pages/admin/ClassesAdmin';
import SchedulesAdmin from './pages/admin/SchedulesAdmin';
import Login from './pages/admin/Login';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Admin Login - Public */}
                    <Route path="/admin/login" element={<Login />} />

                    {/* Admin Routes - Protected */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Dashboard />} />
                        <Route path="products" element={<ProductsAdmin />} />
                        <Route path="classes" element={<ClassesAdmin />} />
                        <Route path="schedules" element={<SchedulesAdmin />} />
                    </Route>

                    {/* Public Routes - with Navbar/Footer */}
                    <Route
                        path="/*"
                        element={
                            <div className="flex flex-col min-h-screen">
                                <Navbar />
                                <main className="grow">
                                    <Routes>
                                        <Route
                                            path="/"
                                            element={<LandingPage />}
                                        />
                                        <Route
                                            path="/cardapio"
                                            element={<Cardapio />}
                                        />
                                        <Route
                                            path="/agendamento"
                                            element={<Agendamento />}
                                        />
                                        <Route
                                            path="/fila"
                                            element={<Fila />}
                                        />
                                    </Routes>
                                </main>
                                <Footer />
                            </div>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
