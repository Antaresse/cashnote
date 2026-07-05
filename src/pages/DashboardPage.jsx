import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { relevesService } from '../services/releves';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [releves, setReleves] = useState([]);
  const [indexKwh, setIndexKwh] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Charger les données depuis le service dédié
  const loadData = async () => {
    try {
      const data = await relevesService.getAll();
      setReleves(data);
    } catch (err) {
      console.error("Erreur lors du chargement :", err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Soumission du formulaire de saisie du Cash Power
  const handleAddReleve = async (e) => {
    e.preventDefault();
    if (!indexKwh || isNaN(indexKwh)) return;
    setLoading(true);
    
    try {
      await relevesService.create(indexKwh, user.id);
      setIndexKwh('');
      await loadData(); // Rafraîchir l'historique
    } catch (err) {
      alert("Erreur lors de l'enregistrement : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Barre de navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', background: '#ffffff', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.3rem' }}>⚡</span>
          <strong style={{ fontSize: '1.1rem', color: '#111' }}>CashPower</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#666', fontSize: '0.85rem' }}>{user?.email}</span>
          <button onClick={logout} style={{ background: '#fff', color: '#ff3b30', border: '1px solid #ff3b30', padding: '6px 12px', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', fontSize: '0.85rem' }}>
            Quitter
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', boxSizing: 'border-box' }}>
        
        {/* Formulaire d'enregistrement */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ marginTop: '0', marginBottom: '12px', fontSize: '1rem', color: '#333' }}>📝 Relever mon compteur</h3>
          <form onSubmit={handleAddReleve} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="number" 
              step="0.01" 
              placeholder="Reste de kWh (ex: 45.2)" 
              value={indexKwh} 
              onChange={e => setIndexKwh(e.target.value)} 
              required 
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
            />
            <button 
              type="submit" 
              disabled={loading}
              style={{ padding: '12px 18px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {loading ? '...' : 'Ajouter'}
            </button>
          </form>
        </div>

        {/* Section Historique */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#111' }}>📈 Suivi de consommation</h3>
          <span style={{ fontSize: '0.8rem', color: '#666' }}>{releves.length} relevé(s)</span>
        </div>

        {fetching ? (
          <p style={{ textAlign: 'center', color: '#999', fontSize: '0.9rem' }}>Chargement de l'historique...</p>
        ) : releves.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f9f9f9', borderRadius: '12px', border: '1px dashed #ccc' }}>
            <p style={{ margin: 0, color: '#666' }}>Aucun relevé enregistré.</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#999' }}>Entrez le niveau actuel de votre Cash Power ci-dessus.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {releves.map((r, index) => {
              const next = releves[index + 1];
              let consoText = '-';
              let isRecharge = false;

              // Calcul automatique intelligent de la consommation
              if (next) {
                const diff = next.index_kwh - r.index_kwh;
                if (diff >= 0) {
                  consoText = `-${diff.toFixed(2)} kWh`;
                } else {
                  consoText = `+${Math.abs(diff).toFixed(2)} kWh (Rechargement)`;
                  isRecharge = true;
                }
              }

              return (
                <div key={r.id} style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#111' }}>
                      {r.index_kwh} <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'normal' }}>kWh restants</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '4px' }}>
                      {new Date(r.created_at).toLocaleDateString('fr-TG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '6px', 
                      fontSize: '0.85rem', 
                      fontWeight: '600',
                      background: index === releves.length - 1 ? '#f0f0f0' : isRecharge ? '#e6f7ed' : '#fdf2f2',
                      color: index === releves.length - 1 ? '#666' : isRecharge ? '#34c759' : '#ff3b30'
                    }}>
                      {index === releves.length - 1 ? 'Premier index' : consoText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}