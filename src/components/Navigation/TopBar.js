import React from 'react';
import { useData } from '../../contexts/DataContext';
import './TopBar.css';

function TopBar() {
  const { loading, error, refreshData } = useData();

  return (
    <header className="topbar">
      <div className="topbar-title">
        <h1>Companion</h1>
      </div>
      <div className="topbar-actions">
        {error && <span className="error-indicator" title={error}>⚠️</span>}
        <button
          onClick={refreshData}
          disabled={loading}
          className="refresh-btn"
          title="Refresh data"
        >
          {loading ? '⟳' : '↻'}
        </button>
      </div>
    </header>
  );
}

export default TopBar;
