import { useState, useEffect } from 'react';
import {
  processApiEvents,
  getActiveEvents,
  getUpcomingEvents
} from '../services/eventTimer';

export function useEventTimers(apiEvents = []) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [processedEvents, setProcessedEvents] = useState([]);
  const [activeEvents, setActiveEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const updateTimers = () => {
      const now = new Date();
      setCurrentTime(now);

      if (apiEvents && apiEvents.length > 0) {
        const processed = processApiEvents(apiEvents, now);
        const active = getActiveEvents(processed);
        const upcoming = getUpcomingEvents(processed, 12);

        setProcessedEvents(processed);
        setActiveEvents(active);
        setUpcomingEvents(upcoming);
      } else {
        setProcessedEvents([]);
        setActiveEvents([]);
        setUpcomingEvents([]);
      }
    };

    // Initial update
    updateTimers();

    // Update every second for live countdowns
    const interval = setInterval(updateTimers, 1000);

    return () => clearInterval(interval);
  }, [apiEvents]);

  return {
    currentTime,
    events: processedEvents,
    activeEvents,
    upcomingEvents
  };
}
