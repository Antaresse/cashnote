import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage'; // On importe notre nouvelle vue

function AppContent() {
  const { user } = useAuth();
  
  // Si l'utilisateur n'est pas connecté, affichage de l'AuthPage
  if (!user) return <AuthPage />;

  // Si connecté, affichage du Dashboard complet
  return <DashboardPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}