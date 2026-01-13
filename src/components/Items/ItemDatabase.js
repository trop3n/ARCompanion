import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import ItemCard from './ItemCard';
import './ItemDatabase.css';

function ItemDatabase() {
  const { items, loading, error } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');

  const categories = useMemo(() => {
    if (!items || items.length === 0) return [];
    const cats = [...new Set(items.map(item => item.category).filter(Boolean))];
    return cats.sort();
  }, [items]);

  const rarities = useMemo(() => {
    if (!items || items.length === 0) return [];
    const rars = [...new Set(items.map(item => item.rarity).filter(Boolean))];
    return rars.sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!items) return [];

    return items.filter(item => {
      const matchesSearch = !searchTerm ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' ||
        item.category === selectedCategory;

      const matchesRarity = selectedRarity === 'all' ||
        item.rarity?.toLowerCase() === selectedRarity.toLowerCase();

      return matchesSearch && matchesCategory && matchesRarity;
    });
  }, [items, searchTerm, selectedCategory, selectedRarity]);

  if (loading) {
    return (
      <div className="item-database-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="item-database-container">
        <div className="error-state">
          <h2>Unable to load items</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="item-database-container">
      <div className="page-header">
        <h1>Item Database</h1>
        <p className="item-count">{filteredItems.length} items</p>
      </div>

      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {categories.length > 0 && (
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        )}

        {rarities.length > 0 && (
          <select
            className="filter-select"
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
          >
            <option value="all">All Rarities</option>
            {rarities.map(rarity => (
              <option key={rarity} value={rarity.toLowerCase()}>{rarity}</option>
            ))}
          </select>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <p>No items found</p>
          {searchTerm && <p className="note">Try adjusting your search or filters</p>}
        </div>
      ) : (
        <div className="items-grid">
          {filteredItems.map((item, index) => (
            <ItemCard key={item.id || `item-${index}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ItemDatabase;
