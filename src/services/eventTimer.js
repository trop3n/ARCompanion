import { addHours, differenceInMilliseconds, startOfHour, format } from 'date-fns';

const DEFAULT_EVENT_ROTATION = [
  { name: 'Night Raid', map: 'Dam', hour: 0 },
  { name: 'Electromagnetic Storm', map: 'Buried City', hour: 1 },
  { name: 'Vortex Anomaly', map: 'Spaceport', hour: 2 },
  { name: 'Night Raid', map: 'Frozen Tundra', hour: 3 },
  { name: 'Sandstorm', map: 'Desert Outpost', hour: 4 },
  { name: 'Electromagnetic Storm', map: 'Dam', hour: 5 },
  { name: 'Vortex Anomaly', map: 'Buried City', hour: 6 },
  { name: 'Night Raid', map: 'Spaceport', hour: 7 },
  { name: 'Sandstorm', map: 'Frozen Tundra', hour: 8 },
  { name: 'Electromagnetic Storm', map: 'Desert Outpost', hour: 9 },
  { name: 'Vortex Anomaly', map: 'Dam', hour: 10 },
  { name: 'Night Raid', map: 'Buried City', hour: 11 },
  { name: 'Sandstorm', map: 'Spaceport', hour: 12 },
  { name: 'Electromagnetic Storm', map: 'Frozen Tundra', hour: 13 },
  { name: 'Vortex Anomaly', map: 'Desert Outpost', hour: 14 },
  { name: 'Night Raid', map: 'Dam', hour: 15 },
  { name: 'Sandstorm', map: 'Buried City', hour: 16 },
  { name: 'Electromagnetic Storm', map: 'Spaceport', hour: 17 },
  { name: 'Vortex Anomaly', map: 'Frozen Tundra', hour: 18 },
  { name: 'Night Raid', map: 'Desert Outpost', hour: 19 },
  { name: 'Sandstorm', map: 'Dam', hour: 20 },
  { name: 'Electromagnetic Storm', map: 'Buried City', hour: 21 },
  { name: 'Vortex Anomaly', map: 'Spaceport', hour: 22 },
  { name: 'Night Raid', map: 'Frozen Tundra', hour: 23 }
];

export function getEventForHour(hour, eventSchedule = DEFAULT_EVENT_ROTATION) {
  const utcHour = hour % 24;
  const event = eventSchedule.find(e => e.hour === utcHour);

  if (!event) {
    return {
      name: 'Unknown Event',
      map: 'Unknown Map',
      hour: utcHour
    };
  }

  return event;
}

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

export function calculateEventTimes(currentTime = new Date(), eventSchedule = DEFAULT_EVENT_ROTATION) {
  const currentHour = startOfHour(currentTime);
  const currentUtcHour = currentTime.getUTCHours();
  const events = [];

  for (let i = 0; i < 24; i++) {
    const eventTime = addHours(currentHour, i);
    const eventUtcHour = eventTime.getUTCHours();
    const event = getEventForHour(eventUtcHour, eventSchedule);

    const endTime = addHours(eventTime, 1);
    const timeUntilStart = differenceInMilliseconds(eventTime, currentTime);
    const timeUntilEnd = differenceInMilliseconds(endTime, currentTime);

    const isActive = timeUntilStart <= 0 && timeUntilEnd > 0;
    const isPast = timeUntilEnd <= 0;

    events.push({
      ...event,
      startTime: eventTime,
      endTime: endTime,
      startTimeFormatted: format(eventTime, 'HH:mm'),
      endTimeFormatted: format(endTime, 'HH:mm'),
      timeUntilStart: Math.max(0, timeUntilStart),
      timeUntilEnd: Math.max(0, timeUntilEnd),
      timeRemainingFormatted: isActive
        ? formatTimeRemaining(timeUntilEnd)
        : formatTimeRemaining(timeUntilStart),
      isActive,
      isPast,
      isUpcoming: !isActive && !isPast
    });
  }

  return events.filter(e => !e.isPast);
}

export function getCurrentActiveEvent(currentTime = new Date(), eventSchedule = DEFAULT_EVENT_ROTATION) {
  const events = calculateEventTimes(currentTime, eventSchedule);
  return events.find(e => e.isActive);
}

export function getUpcomingEvents(currentTime = new Date(), count = 6, eventSchedule = DEFAULT_EVENT_ROTATION) {
  const events = calculateEventTimes(currentTime, eventSchedule);
  return events.filter(e => e.isUpcoming).slice(0, count);
}

export function parseApiEventSchedule(apiData) {
  if (!apiData || !Array.isArray(apiData)) {
    return DEFAULT_EVENT_ROTATION;
  }

  return apiData.map((event, index) => ({
    name: event.name || event.eventName || 'Unknown Event',
    map: event.map || event.location || 'Unknown Map',
    hour: event.hour !== undefined ? event.hour : index
  }));
}
