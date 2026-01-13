import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import './ItemDatabase.css';

const ITEMS_PER_PAGE = 40;

function ItemDatabase() {
  const { items, loading, error } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedItem, setExpandedItem] = useState(null);

  // Get unique item types
  const itemTypes = useMemo(() => {
    if (!items || items.length === 0) return [];
    const types = [...new Set(items.map(item => item.item_type).filter(Boolean))];
    return types.sort();
  }, [items]);

  // Get unique rarities
  const rarities = useMemo(() => {
    if (!items || items.length === 0) return [];
    const rars = [...new Set(items.map(item => item.rarity).filter(Boolean))];
    const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
    return rars.sort((a, b) => rarityOrder.indexOf(a) - rarityOrder.indexOf(b));
  }, [items]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    if (!items) return [];

    let result = items.filter(item => {
      const matchesSearch = !searchTerm || searchTerm.length < 3 ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === 'all' || item.item_type === selectedType;
      const matchesRarity = selectedRarity === 'all' || item.rarity === selectedRarity;

      return matchesSearch && matchesType && matchesRarity;
    });

    // Sort
    result.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'name':
          aVal = a.name || '';
          bVal = b.name || '';
          break;
        case 'value':
          aVal = a.value || 0;
          bVal = b.value || 0;
          break;
        case 'weight':
          aVal = a.weight || 0;
          bVal = b.weight || 0;
          break;
        case 'rarity':
          const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
          aVal = rarityOrder.indexOf(a.rarity);
          bVal = rarityOrder.indexOf(b.rarity);
          break;
        default:
          aVal = a.name || '';
          bVal = b.name || '';
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [items, searchTerm, selectedType, selectedRarity, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  // Reset page when filters change
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getRarityClass = (rarity) => {
    return `rarity-${(rarity || 'common').toLowerCase()}`;
  };

  if (loading) {
    return (
      <div className="database-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="database-container">
      <div className="page-header">
        <h1>Database</h1>
        <p className="subtitle">{filteredItems.length} items found</p>
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <input
            type="text"
            className="search-input"
            placeholder="Search items (min 3 chars)..."
            value={searchTerm}
            onChange={(e) => handleFilterChange(setSearchTerm)(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={selectedType}
            onChange={(e) => handleFilterChange(setSelectedType)(e.target.value)}
          >
            <option value="all">All Types</option>
            {itemTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={selectedRarity}
            onChange={(e) => handleFilterChange(setSelectedRarity)(e.target.value)}
          >
            <option value="all">All Rarities</option>
            {rarities.map(rarity => (
              <option key={rarity} value={rarity}>{rarity}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="items-table-container">
        <table className="items-table">
          <thead>
            <tr>
              <th className="col-icon"></th>
              <th className="col-name sortable" onClick={() => handleSort('name')}>
                Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="col-type">Type</th>
              <th className="col-rarity sortable" onClick={() => handleSort('rarity')}>
                Rarity {sortBy === 'rarity' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="col-value sortable" onClick={() => handleSort('value')}>
                Value {sortBy === 'value' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="col-weight sortable" onClick={() => handleSort('weight')}>
                Weight {sortBy === 'weight' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-row">
                  No items found matching your filters
                </td>
              </tr>
            ) : (
              paginatedItems.map((item, index) => (
                <React.Fragment key={item.id || index}>
                  <tr
                    className={`item-row ${expandedItem === item.id ? 'expanded' : ''}`}
                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                  >
                    <td className="col-icon">
                      {item.icon ? (
                        <img
                          src={item.icon}
                          alt={item.name}
                          className="item-icon"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="item-icon-placeholder">
                          {item.name?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                    </td>
                    <td className="col-name">
                      <span className="item-name">{item.name}</span>
                    </td>
                    <td className="col-type">
                      <span className="item-type">{item.item_type || '-'}</span>
                    </td>
                    <td className="col-rarity">
                      <span className={`rarity-badge ${getRarityClass(item.rarity)}`}>
                        {item.rarity || '-'}
                      </span>
                    </td>
                    <td className="col-value">
                      {item.value ? `${item.value}` : '-'}
                    </td>
                    <td className="col-weight">
                      {item.weight ? `${item.weight} kg` : '-'}
                    </td>
                  </tr>
                  {expandedItem === item.id && (
                    <tr className="item-details-row">
                      <td colSpan="6">
                        <div className="item-details">
                          {item.description && (
                            <p className="item-description">{item.description}</p>
                          )}
                          <div className="item-stats">
                            {item.stat_block && Object.entries(item.stat_block).map(([key, value]) => (
                              <div key={key} className="stat-item">
                                <span className="stat-label">{formatStatName(key)}:</span>
                                <span className="stat-value">{formatStatValue(value)}</span>
                              </div>
                            ))}
                            {item.ammo_type && (
                              <div className="stat-item">
                                <span className="stat-label">Ammo Type:</span>
                                <span className="stat-value">{item.ammo_type}</span>
                              </div>
                            )}
                            {item.magazine_size && (
                              <div className="stat-item">
                                <span className="stat-label">Magazine:</span>
                                <span className="stat-value">{item.magazine_size}</span>
                              </div>
                            )}
                            {item.workbench && (
                              <div className="stat-item">
                                <span className="stat-label">Workbench:</span>
                                <span className="stat-value">{item.workbench}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            ««
          </button>
          <button
            className="page-btn"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            «
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="page-btn"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            »
          </button>
          <button
            className="page-btn"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            »»
          </button>
        </div>
      )}
    </div>
  );
}

// Helper functions
function formatStatName(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

function formatStatValue(value) {
  if (typeof value === 'number') {
    return value % 1 === 0 ? value : value.toFixed(2);
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  return value;
}

export default ItemDatabase;
