'use client';

import {
  Suspense,
  useEffect,
  useState,
} from 'react';

import { useSearchParams }
from 'next/navigation';

import Link from 'next/link';

import Navbar
from '../../components/Navbar';

import EventCard
from '../../components/EventCard';

import { supabase }
from '../../lib/supabase';

function SearchLocationContent() {

  const searchParams =
    useSearchParams();

const query =
  searchParams.get('state') || '';

  const [events, setEvents] =
    useState([]);

  useEffect(() => {
    fetchEvents();
  }, [query]);

const fetchEvents = async () => {

  const { data, error } =
    await supabase
      .from('events')
      .select(`
        id,
        title,
        image,
        date,
        place,
        state,
        price,
        category
      `)
      .ilike('state', `%${query}%`);

  if (data) {
    setEvents(data);
  }



  };

  return (
    <div>

      <Navbar />

      <div className="searchPage">

        <h1>
          Search Results
        </h1>

        <p className="searchHeader">

          You're searching for
          {' '}
          <strong>
            "{query}"
          </strong>

        </p>

        <div className="eventGrid">

          {events.length > 0 ? (

            events.map((event) => (

            <EventCard
                key={event.id}
                event={event}
            />

            ))

          ) : (

            <p>
              No events found.
            </p>

          )}

        </div>

      </div>

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SearchLocationContent />
    </Suspense>
  );
}