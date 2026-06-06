import Link from 'next/link';

const formatDate = (dateString) => {
  const date = new Date(dateString);

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }) +
  ' • ' +
  date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};


export default function EventCard({ event }) {
  return (
    <Link href={`/event/${event.id}`}>
      <div className="eventCard">
        <img
          src={event.image}
          alt={event.title}
        />

        <div className="eventContent">
          <div className="badge">
            Going fast
          </div>

          <div className="eventTopRow">

            <h3>{event.title}</h3>

            <p className="eventCategory">
              {event.category}
            </p>

          </div>

        <p className="date">
          {formatDate(event.date)}
        </p>

        <p className="place">
          {event.place} | {event.state}
        </p>

          <h4>{event.price}</h4>
        </div>
      </div>
    </Link>
  );
}