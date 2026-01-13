import { useState, useEffect } from 'react';
import {
  calculateEventTimes,
  getCurrentActiveEvent,
  getUpcomingEvents,
  parseApiEventSchedule
} from '../services/eventTimer';

export function useEventTimers(eventScheduleData = null) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const eventSchedule = eventScheduleData
    ? parseApiEventSchedule(eventScheduleData)
    : undefined;

  useEffect(() => {
    const updateTimers = () => {
      const now = new Date();
      setCurrentTime(now);

      const allEvents = calculateEventTimes(now, eventSchedule);
      const current = getCurrentActiveEvent(now, eventSchedule);
      const upcoming = getUpcomingEvents(now, 6, eventSchedule);

      setEvents(allEvents);
      setActiveEvent(current);
      setUpcomingEvents(upcoming);
    };

    updateTimers();

    const interval = setInterval(updateTimers, 1000);

    return () => clearInterval(interval);
  }, [eventScheduleData]);

  return {
    currentTime,
    events,
    activeEvent,
    upcomingEvents
  };
}
