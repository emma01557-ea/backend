// src/App.jsx
import { useState } from "react";
import LoginForm from './components/loginForm';
<<<<<<< HEAD
import PanelUsuario from './components/PanelUsuario';
=======
import PanelUsuario from './components/panelUsuario';
>>>>>>> 2dd534b (WIP: cambios locales antes del pull)

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <PanelUsuario user={user} />
      )}
    </div>
  );
}

export default App;
