import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useEventTimers } from '../../hooks/useEventTimers';
import EventTimerCard from './EventTimerCard';
import './EventTimerList.css';

function EventTimerList() {
  const { events: eventScheduleData, loading, error } = useData();
  const { activeEvent, upcomingEvents, currentTime } = useEventTimers(eventScheduleData);

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

  if (error) {
    return (
      <div className="event-timers-container">
        <div className="error-state">
          <h2>Unable to load event data</h2>
          <p>{error}</p>
          <p className="note">Showing default event schedule</p>
        </div>
        <div className="events-section">
          <EventsDisplay activeEvent={activeEvent} upcomingEvents={upcomingEvents} currentTime={currentTime} />
        </div>
      </div>
    );
  }

  return (
    <div className="event-timers-container">
      <div className="page-header">
        <h1>Event Timers</h1>
        <div className="current-time">
          Current UTC: {currentTime.toUTCString()}
        </div>
      </div>

      <EventsDisplay activeEvent={activeEvent} upcomingEvents={upcomingEvents} currentTime={currentTime} />
    </div>
  );
}

function EventsDisplay({ activeEvent, upcomingEvents, currentTime }) {
  return (
    <>
      {activeEvent && (
        <div className="events-section">
          <h2 className="section-title">Active Event</h2>
          <div className="active-event">
            <EventTimerCard event={activeEvent} />
          </div>
        </div>
      )}

      {upcomingEvents.length > 0 && (
        <div className="events-section">
          <h2 className="section-title">Upcoming Events</h2>
          <div className="upcoming-events">
            {upcomingEvents.map((event, index) => (
              <EventTimerCard key={`${event.name}-${event.startTime}-${index}`} event={event} />
            ))}
          </div>
        </div>
      )}

      {!activeEvent && upcomingEvents.length === 0 && (
        <div className="empty-state">
          <p>No events scheduled</p>
        </div>
      )}
    </>
  );
}

export default EventTimerList;
