import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Appel au service d'inscription du Context
        await signup(email, password);
        setMessage('🔑 Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setIsSignUp(false); // On le redirige vers l'écran de connexion
      } else {
        // Appel au service de connexion du Context
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '40px auto' }}>
      {/* En-tête de l'application */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0' }}>⚡</h1>
        <h2 style={{ marginTop: '10px', color: '#333' }}>CashPower Tracker</h2>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>Suivez votre consommation CEET au Togo</p>
      </div>

      {/* Boite du formulaire */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
        <h3 style={{ marginTop: '0', marginBottom: '20px', textAlign: 'center' }}>
          {isSignUp ? 'Créer un compte' : 'Connexion'}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '500' }}>Email</label>
            <input 
              type="email" 
              placeholder="votre_email@gmail.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '500' }}>Mot de passe</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
          >
            {loading ? 'Patientez...' : isSignUp ? "S'inscrire" : 'Se connecter'}
          </button>
        </form>

        {/* Retours d'états (Erreur ou Succès) */}
        {error && <p style={{ color: '#ff3b30', fontSize: '0.85rem', marginTop: '15px', textAlign: 'center' }}>{error}</p>}
        {message && <p style={{ color: '#34c759', fontSize: '0.85rem', marginTop: '15px', textAlign: 'center' }}>{message}</p>}

        {/* Liens de basculement mode Connexion / Inscription */}
        <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage(''); }} 
            style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            {isSignUp ? 'Déjà un compte ? Se connecter' : "Nouveau ici ? Créez un compte gratuitement"}
          </button>
        </div>
      </div>
    </div>
  );
}