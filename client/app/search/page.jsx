'use client';

import { useEffect, useState }
from 'react';

import { useSearchParams }
from 'next/navigation';

import Link from 'next/link';

import Navbar
from '../../components/Navbar';

import { supabase }
from '../../lib/supabase';

export default function SearchPage() {

  const searchParams =
    useSearchParams();

  const query =
    searchParams.get('q');

  const [events, setEvents] =
    useState([]);

  useEffect(() => {
    fetchEvents();
  }, [query]);

  const fetchEvents = async () => {

    const { data, error } =
      await supabase
        .from('events')
        .select('*');

    if (data) {

      const filtered =
        data.filter((event) => {

          const titleMatch =
            event.title
              ?.toLowerCase()
              .includes(
                query.toLowerCase()
              );

          const categoryMatch =
            event.category
              ?.toLowerCase()
              .includes(
                query.toLowerCase()
              );

          return (
            titleMatch ||
            categoryMatch
          );

        });

      setEvents(filtered);

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

              <Link
                href={`/event/${event.id}`}
                key={event.id}
              >

                <div className="eventCard">

                  <img
                    src={event.image}
                    alt={event.title}
                  />

                  <div className="eventContent">

                <div className="eventTopRow">

                  <h3>
                    {event.title}
                  </h3>

                  <p className="eventCategory">
                    {event.category}
                  </p>

                </div>

                    <p className="place">
                      {event.place}
                    </p>

                    <h4>
                      {event.price}
                    </h4>

                  </div>

                </div>

              </Link>

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