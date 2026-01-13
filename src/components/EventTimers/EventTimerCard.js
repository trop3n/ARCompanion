import React from 'react';
import './EventTimerCard.css';

function EventTimerCard({ event }) {
  const getEventColor = (eventName) => {
    const colors = {
      'Night Raid': '#6366f1',
      'Electromagnetic Storm': '#8b5cf6',
      'Vortex Anomaly': '#ec4899',
      'Sandstorm': '#f59e0b',
      'default': '#3b82f6'
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
        <div className="event-name" style={{ color: eventColor }}>
          {event.name}
        </div>
        {event.isActive && <span className="active-badge">LIVE</span>}
      </div>

      <div className="event-map">{event.map}</div>

      <div className="event-time">
        <div className="time-range">
          {event.startTimeFormatted} - {event.endTimeFormatted} UTC
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
