import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import './NeededItems.css';

function NeededItems() {
  const { quests, hideout, expedition, loading, error } = useData();
  const [activeTab, setActiveTab] = useState('quests');

  // Aggregate items needed for quests
  const questItems = useMemo(() => {
    if (!quests || quests.length === 0) return [];

    const itemMap = new Map();

    quests.forEach(quest => {
      if (quest.required_items && Array.isArray(quest.required_items)) {
        quest.required_items.forEach(req => {
          const item = req.item || req;
          const itemId = item.id || req.id;
          const itemName = item.name || req.name || 'Unknown Item';

          if (itemMap.has(itemId)) {
            const existing = itemMap.get(itemId);
            existing.quantity += req.quantity || 1;
            existing.usedIn.push(quest.name);
          } else {
            itemMap.set(itemId, {
              id: itemId,
              name: itemName,
              icon: item.icon,
              rarity: item.rarity,
              itemType: item.item_type,
              quantity: req.quantity || 1,
              usedIn: [quest.name]
            });
          }
        });
      }
    });

    return Array.from(itemMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [quests]);

  // Aggregate items needed for workshop/hideout upgrades
  const workshopItems = useMemo(() => {
    if (!hideout || hideout.length === 0) return [];

    const itemMap = new Map();

    hideout.forEach(workshop => {
      if (workshop.levels) {
        Object.entries(workshop.levels).forEach(([level, levelData]) => {
          if (levelData.requiredItems && Array.isArray(levelData.requiredItems)) {
            levelData.requiredItems.forEach(req => {
              const itemId = req.id;
              const itemName = req.name || itemId;

              if (itemMap.has(itemId)) {
                const existing = itemMap.get(itemId);
                existing.quantity += req.quantity || 1;
                existing.usedIn.push(`${workshop.name} Lv${level}`);
              } else {
                itemMap.set(itemId, {
                  id: itemId,
                  name: itemName,
                  icon: req.icon,
                  quantity: req.quantity || 1,
                  usedIn: [`${workshop.name} Lv${level}`]
                });
              }
            });
          }
        });
      }
    });

    return Array.from(itemMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [hideout]);

  // Aggregate items needed for expedition
  const expeditionItems = useMemo(() => {
    if (!expedition || expedition.length === 0) return [];

    const itemMap = new Map();

    expedition.forEach(phase => {
      if (phase.requirements && Array.isArray(phase.requirements)) {
        phase.requirements.forEach(req => {
          const itemId = req.id;
          const itemName = req.name || itemId;

          if (itemMap.has(itemId)) {
            const existing = itemMap.get(itemId);
            existing.quantity += req.need || req.quantity || 1;
            existing.usedIn.push(`${phase.project} - ${phase.phase}`);
          } else {
            itemMap.set(itemId, {
              id: itemId,
              name: itemName,
              icon: req.icon,
              quantity: req.need || req.quantity || 1,
              usedIn: [`${phase.project} - ${phase.phase}`]
            });
          }
        });
      }
    });

    return Array.from(itemMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [expedition]);

  const tabs = [
    { id: 'quests', label: 'Quests', count: questItems.length },
    { id: 'workshop', label: 'Workshop', count: workshopItems.length },
    { id: 'expedition', label: 'Expedition', count: expeditionItems.length }
  ];

  const getActiveItems = () => {
    switch (activeTab) {
      case 'quests':
        return questItems;
      case 'workshop':
        return workshopItems;
      case 'expedition':
        return expeditionItems;
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="needed-items-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading needed items...</p>
        </div>
      </div>
    );
  }

  const activeItems = getActiveItems();

  return (
    <div className="needed-items-container">
      <div className="page-header">
        <h1>Needed Items</h1>
        <p className="subtitle">Track items required for quests, workshop upgrades, and expedition</p>
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="items-content">
        {activeItems.length === 0 ? (
          <div className="empty-state">
            <p>No items found for this category</p>
            <p className="note">Data may not be available from the API</p>
          </div>
        ) : (
          <div className="items-grid">
            {activeItems.map((item, index) => (
              <div key={item.id || index} className="needed-item-card">
                <div className="item-header">
                  {item.icon ? (
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="item-icon"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="item-icon-placeholder">
                      {item.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    {item.rarity && (
                      <div className={`item-rarity rarity-${item.rarity.toLowerCase()}`}>
                        {item.rarity}
                      </div>
                    )}
                  </div>
                  <div className="item-quantity">
                    <span className="quantity-label">Need:</span>
                    <span className="quantity-value">{item.quantity}</span>
                  </div>
                </div>

                {item.usedIn && item.usedIn.length > 0 && (
                  <div className="used-in">
                    <span className="used-in-label">Used in:</span>
                    <div className="used-in-list">
                      {item.usedIn.slice(0, 3).map((use, i) => (
                        <span key={i} className="used-in-item">{use}</span>
                      ))}
                      {item.usedIn.length > 3 && (
                        <span className="used-in-more">+{item.usedIn.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="total-summary">
        <span>Total unique items: {activeItems.length}</span>
        <span>Total quantity needed: {activeItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
      </div>
    </div>
  );
}

export default NeededItems;
