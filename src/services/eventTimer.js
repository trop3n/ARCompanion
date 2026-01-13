import { format, differenceInMilliseconds } from 'date-fns';

/**
 * Format milliseconds into a human-readable countdown string
 */
export function formatTimeRemaining(milliseconds) {
  if (milliseconds < 0) return 'Expired';

  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Process raw API events and calculate timer information
 * API format: { name, map, icon, startTime, endTime }
 */
export function processApiEvents(apiEvents, currentTime = new Date()) {
  if (!apiEvents || !Array.isArray(apiEvents)) {
    return [];
  }

  const now = currentTime.getTime();

  return apiEvents
    .map(event => {
      const startTime = new Date(event.startTime);
      const endTime = new Date(event.endTime);

      const timeUntilStart = differenceInMilliseconds(startTime, currentTime);
      const timeUntilEnd = differenceInMilliseconds(endTime, currentTime);

      const isActive = timeUntilStart <= 0 && timeUntilEnd > 0;
      const isPast = timeUntilEnd <= 0;
      const isUpcoming = timeUntilStart > 0;

      return {
        name: event.name,
        map: event.map,
        icon: event.icon,
        startTime,
        endTime,
        startTimeFormatted: format(startTime, 'HH:mm'),
        endTimeFormatted: format(endTime, 'HH:mm'),
        dateFormatted: format(startTime, 'MMM d'),
        timeUntilStart: Math.max(0, timeUntilStart),
        timeUntilEnd: Math.max(0, timeUntilEnd),
        timeRemainingFormatted: isActive
          ? formatTimeRemaining(timeUntilEnd)
          : formatTimeRemaining(timeUntilStart),
        isActive,
        isPast,
        isUpcoming
      };
    })
    .filter(event => !event.isPast) // Remove past events
    .sort((a, b) => a.startTime - b.startTime); // Sort by start time
}

/**
 * Get all active events (currently running)
 */
export function getActiveEvents(processedEvents) {
  return processedEvents.filter(event => event.isActive);
}

/**
 * Get upcoming events (not yet started)
 */
export function getUpcomingEvents(processedEvents, limit = 12) {
  return processedEvents
    .filter(event => event.isUpcoming)
    .slice(0, limit);
}

/**
 * Group events by map for filtering
 */
export function groupEventsByMap(processedEvents) {
  const grouped = {};

  processedEvents.forEach(event => {
    if (!grouped[event.map]) {
      grouped[event.map] = [];
    }
    grouped[event.map].push(event);
  });

  return grouped;
}

/**
 * Get unique event types from the events list
 */
export function getEventTypes(processedEvents) {
  const types = [...new Set(processedEvents.map(e => e.name))];
  return types.sort();
}

/**
 * Get unique maps from the events list
 */
export function getMaps(processedEvents) {
  const maps = [...new Set(processedEvents.map(e => e.map))];
  return maps.sort();
}
