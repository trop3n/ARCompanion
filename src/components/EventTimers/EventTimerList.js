import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useEventTimers } from '../../hooks/useEventTimers';
import EventTimerCard from './EventTimerCard';
import './EventTimerList.css';

function EventTimerList() {
  const { events: apiEvents, loading, error } = useData();
  const { activeEvents, upcomingEvents, currentTime } = useEventTimers(apiEvents);

  if (loading) {
    return (
      <div className="event-timers-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading event data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="event-timers-container">
      <div className="page-header">
        <h1>Event Timers</h1>
        <div className="current-time">
          {currentTime.toLocaleString()} (Local Time)
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      {activeEvents.length > 0 && (
        <div className="events-section">
          <h2 className="section-title">
            Active Events <span className="count">({activeEvents.length})</span>
          </h2>
          <div className="active-events-grid">
            {activeEvents.map((event, index) => (
              <EventTimerCard
                key={`active-${event.name}-${event.map}-${index}`}
                event={event}
              />
            ))}
          </div>
        </div>
      )}

      {upcomingEvents.length > 0 && (
        <div className="events-section">
          <h2 className="section-title">
            Upcoming Events <span className="count">({upcomingEvents.length})</span>
          </h2>
          <div className="upcoming-events-grid">
            {upcomingEvents.map((event, index) => (
              <EventTimerCard
                key={`upcoming-${event.name}-${event.map}-${index}`}
                event={event}
              />
            ))}
          </div>
        </div>
      )}

      {activeEvents.length === 0 && upcomingEvents.length === 0 && !loading && (
        <div className="empty-state">
          <p>No events available</p>
          {!apiEvents || apiEvents.length === 0 ? (
            <p className="note">Unable to load event data from the API</p>
          ) : (
            <p className="note">All scheduled events have passed</p>
          )}
        </div>
      )}
    </div>
  );
}

export default EventTimerList;
