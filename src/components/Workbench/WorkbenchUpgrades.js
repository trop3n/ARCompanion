import React from 'react';
import { useData } from '../../contexts/DataContext';
import './WorkbenchUpgrades.css';

function WorkbenchUpgrades() {
  const { workbench, loading, error } = useData();

  if (loading) {
    return (
      <div className="workbench-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading workbench data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="workbench-container">
        <div className="error-state">
          <h2>Unable to load workbench data</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!workbench || workbench.length === 0) {
    return (
      <div className="workbench-container">
        <div className="page-header">
          <h1>Workbench Upgrades</h1>
        </div>
        <div className="empty-state">
          <p>No workbench upgrade data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="workbench-container">
      <div className="page-header">
        <h1>Workbench Upgrades</h1>
        <p className="subtitle">Upgrade requirements and benefits</p>
      </div>

      <div className="upgrades-list">
        {workbench.map((upgrade, index) => (
          <div key={upgrade.id || index} className="upgrade-card">
            <div className="upgrade-header">
              <div className="upgrade-level-badge">
                Level {upgrade.level || index + 1}
              </div>
              <h3 className="upgrade-name">{upgrade.name || upgrade.title || 'Workbench Upgrade'}</h3>
            </div>

            {upgrade.description && (
              <p className="upgrade-description">{upgrade.description}</p>
            )}

            <div className="upgrade-content">
              {upgrade.requirements && upgrade.requirements.length > 0 && (
                <div className="requirements-section">
                  <h4>Requirements</h4>
                  <div className="requirements-list">
                    {upgrade.requirements.map((req, idx) => (
                      <div key={idx} className="requirement-item">
                        <span className="req-name">{req.name || req.item}</span>
                        <span className="req-amount">x{req.amount || req.quantity || 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {upgrade.benefits && upgrade.benefits.length > 0 && (
                <div className="benefits-section">
                  <h4>Benefits</h4>
                  <ul className="benefits-list">
                    {upgrade.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit.description || benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {upgrade.cost && (
                <div className="cost-section">
                  <span className="cost-label">Cost:</span>
                  <span className="cost-value">{upgrade.cost} Credits</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkbenchUpgrades;
