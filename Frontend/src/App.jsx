// src/App.jsx
import { useState } from "react";
import LoginForm from './components/loginForm';
import PanelUsuario from './components/panelUsuario';
import LoginAdmin from './components/loginAdmin';
import PanelAdmin from './components/panelAdmin';


function App() {
  const [vista, setVista] = useState('loginUsuario'); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      {vista === 'loginUsuario' && (
        <LoginForm
          onLoginSuccess={(userData) => {
            setUser(userData);
            setVista('panelUsuario');
          }}
          onSwitchToAdmin={() => setVista('loginAdmin')}
        />
      )}

      {vista === 'loginAdmin' && (
        <LoginAdmin
          onLoginSuccess={(adminData) => {
            setUser(adminData);
            setVista('panelAdmin');
          }}
          onBackToUserLogin={() => setVista('loginUsuario')}
        />
      )}

      {vista === 'panelUsuario' && (
        <PanelUsuario
          user={user}
          setUser={setUser}
          setIsLoggedIn={() => setVista('loginUsuario')}
        />
      )}

      {vista === 'panelAdmin' && (
        <PanelAdmin
          user={user}
          setUser={setUser}
          setIsLoggedIn={() => setVista('loginAdmin')}
          setVista={setVista}
        />
      )}
    </div>
  );
}

export default App;
