import React from 'react';
import { useData } from '../../contexts/DataContext';
import './ExpeditionProject.css';

function ExpeditionProject() {
  const { quests, loading, error } = useData();

  if (loading) {
    return (
      <div className="expedition-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading expedition data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="expedition-container">
        <div className="error-state">
          <h2>Unable to load expedition data</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!quests || quests.length === 0) {
    return (
      <div className="expedition-container">
        <div className="page-header">
          <h1>Expedition Projects</h1>
        </div>
        <div className="empty-state">
          <p>No expedition data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expedition-container">
      <div className="page-header">
        <h1>Expedition Projects</h1>
        <p className="subtitle">Materials and requirements for expedition projects</p>
      </div>

      <div className="projects-list">
        {quests.map((quest, index) => (
          <div key={quest.id || index} className="project-card">
            <div className="project-header">
              <h3 className="project-name">{quest.name || quest.title || 'Unnamed Project'}</h3>
              {quest.reward && (
                <span className="project-reward">Reward: {quest.reward}</span>
              )}
            </div>

            {quest.description && (
              <p className="project-description">{quest.description}</p>
            )}

            {quest.materials && quest.materials.length > 0 && (
              <div className="materials-section">
                <h4>Required Materials</h4>
                <div className="materials-list">
                  {quest.materials.map((material, idx) => (
                    <div key={idx} className="material-item">
                      <span className="material-name">{material.name || material.item}</span>
                      <span className="material-amount">x{material.amount || material.quantity || 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {quest.objectives && quest.objectives.length > 0 && (
              <div className="objectives-section">
                <h4>Objectives</h4>
                <ul className="objectives-list">
                  {quest.objectives.map((objective, idx) => (
                    <li key={idx}>{objective.description || objective}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpeditionProject;
