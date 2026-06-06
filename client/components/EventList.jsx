'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

import EventCard from './EventCard';

export default function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
      axios.get('https://fliby-event-production.up.railway.app/events')
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="eventGrid">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
        />
      ))}
    </div>
  );
}