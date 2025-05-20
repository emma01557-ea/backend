// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import RegisterForm from './components/RegisterForm';
import LoginForm from './components/loginForm';
import PanelUsuario from './components/panelUsuario';


/*// Componente para proteger rutas privadas (admin)
function PrivateRoute({ children, isAdmin }) {
  if (!isAdmin) {
    return <Navigate to="/authRoutes/login" replace />;
  }
  return children;
}


function App() {
  // Simulación de autenticación (luego reemplazás esto con lógica real de sesión o JWT)
 // const isAuthenticated = localStorage.getItem('token'); // o el campo que estés usando
  
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("authRoutes") === "true" // lee del localStorage
  );

  const handleLogin = (status) => {
    setIsAdmin(status);
    localStorage.setItem("authRoutes", status); // guarda sesi�n
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("authRoutes"); // elimina sesi�n
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm/>} />
        <Route
          path="/Registrar"
          element={
            <PrivateRoute isAdmin={isAdmin}>
              <RegisterForm onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route
          path="/authRoutes/login"
          element={<RegisterForm onLogin={handleLogin} />}
        />
      </Routes>
    </Router>
  );
}*/

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState('login'); // 'login', 'register', 'panel'
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setView('panel');
  };

  return (
    <div className="App">
      {!isLoggedIn && view === 'login' && (
        <LoginForm
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setView('register')}
        />
      )}
      {!isLoggedIn && view === 'register' && (
        <RegisterForm
          onSuccess={handleLoginSuccess}
          onSwitchToLogin={() => setView('login')}
        />
      )}
      {isLoggedIn && view === 'panel' && user && (
        <PanelUsuario user={user} />
      )}
    </div>
  );
}
/*
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <div>
      {!isAuthenticated ? (
        showRegister ? (
          <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginForm
            onLoginSuccess={() => setIsAuthenticated(true)}
            onSwitchToRegister={() => setShowRegister(true)}
          />
        )
      ) : (
        <PanelUsuario/>
      )}
    </div>
  );
}*/



export default App;
