import React, { useState } from 'react';
import './ItemCard.css';

function ItemCard({ item }) {
  const [expanded, setExpanded] = useState(false);

  const getRarityColor = (rarity) => {
    const colors = {
      common: '#9ca3af',
      uncommon: '#10b981',
      rare: '#3b82f6',
      epic: '#8b5cf6',
      legendary: '#f59e0b',
      default: '#6b7280'
    };
    return colors[rarity?.toLowerCase()] || colors.default;
  };

  const rarityColor = getRarityColor(item.rarity);

  return (
    <div className="item-card" style={{ borderTopColor: rarityColor }}>
      <div className="item-header">
        <div className="item-icon-placeholder" style={{ backgroundColor: rarityColor }}>
          {item.icon || item.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="item-title-section">
          <h3 className="item-name">{item.name || 'Unknown Item'}</h3>
          {item.rarity && (
            <span className="item-rarity" style={{ color: rarityColor }}>
              {item.rarity}
            </span>
          )}
        </div>
      </div>

      {item.description && (
        <p className="item-description">{item.description}</p>
      )}

      <div className="item-stats">
        {item.sellValue !== undefined && (
          <div className="stat-item">
            <span className="stat-label">Sell Value:</span>
            <span className="stat-value">{item.sellValue} Credits</span>
          </div>
        )}

        {item.recycleOutput && (
          <div className="stat-item">
            <span className="stat-label">Recycles Into:</span>
            <span className="stat-value">{item.recycleOutput}</span>
          </div>
        )}

        {item.category && (
          <div className="stat-item">
            <span className="stat-label">Category:</span>
            <span className="stat-value">{item.category}</span>
          </div>
        )}
      </div>

      {item.craftingRecipes && item.craftingRecipes.length > 0 && (
        <div className="crafting-section">
          <button
            className="expand-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '▼' : '▶'} Used in {item.craftingRecipes.length} recipe(s)
          </button>

          {expanded && (
            <div className="crafting-recipes">
              {item.craftingRecipes.map((recipe, index) => (
                <div key={index} className="recipe-item">
                  <span className="recipe-name">{recipe.name || recipe}</span>
                  {recipe.amount && <span className="recipe-amount">x{recipe.amount}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ItemCard;
