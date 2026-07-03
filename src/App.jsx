import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage'; // Notre nouveau fichier !

function AppContent() {
  const { user } = useAuth();
  
  // Si l'utilisateur n'est pas connecté, on lui montre obligatoirement la page de Login/Register
  if (!user) return <AuthPage />;

  return (
    <div>
      {/* On affichera la page Dashboard ici dès qu'on l'aura générée */}
      <h1>Bienvenue sur votre espace connecté !</h1>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}