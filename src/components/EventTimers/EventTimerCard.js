import React from 'react';
import './EventTimerCard.css';

function EventTimerCard({ event }) {
  const getEventColor = (eventName) => {
    const colors = {
      'Night Raid': '#6366f1',
      'Electromagnetic Storm': '#8b5cf6',
      'Harvester': '#10b981',
      'Matriarch': '#ef4444',
      'Husk Graveyard': '#6b7280',
      'Uncovered Caches': '#f59e0b',
      'Locked Gate': '#3b82f6',
      'Launch Tower Loot': '#06b6d4',
      'Hidden Bunker': '#84cc16',
      'Prospecting Probes': '#f97316',
      'Lush Blooms': '#22c55e',
      'default': '#4a9eff'
    };
    return colors[eventName] || colors.default;
  };

  const eventColor = getEventColor(event.name);

  return (
    <div
      className={`event-card ${event.isActive ? 'active' : ''}`}
      style={{ borderLeftColor: eventColor }}
    >
      <div className="event-header">
        <div className="event-icon-wrapper">
          {event.icon ? (
            <img
              src={event.icon}
              alt={event.name}
              className="event-icon"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="event-icon-fallback"
            style={{
              backgroundColor: eventColor,
              display: event.icon ? 'none' : 'flex'
            }}
          >
            {event.name?.[0]?.toUpperCase() || '?'}
          </div>
        </div>
        <div className="event-title-section">
          <div className="event-name" style={{ color: eventColor }}>
            {event.name}
          </div>
          <div className="event-map">{event.map}</div>
        </div>
        {event.isActive && <span className="active-badge">LIVE</span>}
      </div>

      <div className="event-time">
        <div className="time-range">
          {event.dateFormatted && (
            <span className="event-date">{event.dateFormatted} • </span>
          )}
          {event.startTimeFormatted} - {event.endTimeFormatted}
        </div>
        <div className="time-remaining">
          {event.isActive ? 'Ends in: ' : 'Starts in: '}
          <span className="countdown">{event.timeRemainingFormatted}</span>
        </div>
      </div>
    </div>
  );
}

export default EventTimerCard;
