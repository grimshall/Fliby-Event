'use client';

import { useEffect, useState } from 'react';

import Navbar from '../../components/Navbar';

import { supabase } from '../../lib/supabase';

export default function TicketHistoryPage() {

  const [tickets, setTickets] =
    useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } =
      await supabase
        .from('registrations')
        .select('*')
        .eq('user_email', user.email)
        .order('created_at', {
          ascending: false,
        });

    if (data) {
      setTickets(data);
    }
  };

  return (
    <div>

      <Navbar />

      <div className="ticketHistoryPage">

        <h1>
          Ticket History
        </h1>

        <p className="ticketSubtitle">
          Your reserved events
        </p>

        {tickets.length === 0 ? (

          <div className="emptyTickets">

            <h2>
              No tickets yet
            </h2>

            <p>
              Once you reserve a spot,
              your event tickets will
              appear here.
            </p>

          </div>

        ) : (

          <div className="ticketGrid">

  {tickets.map((ticket) => (

   <div
  className="ticketCard"
  key={ticket.id}
>

  <img
    src={ticket.event_image}
    alt={ticket.event_title}
    className="ticketImage"
  />

  <div className="ticketInfo">

    <h2>
      {ticket.event_title}
    </h2>

    <p>
      Quantity:
      {' '}
      {ticket.quantity}
    </p>

    <p>
      Total:
      {' '}
      {ticket.total}
    </p>

    <p>
      Registered as:
      {' '}
      {ticket.user_name}
    </p>

   {ticket.event_date && (
  <p>
    Event Date:
    {' '}
    {new Date(
      ticket.event_date
    ).toLocaleDateString(
      'en-US',
      {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }
    )}
  </p>
)}

{ticket.event_date && (
  <p>
    Event Time:
    {' '}
    {new Date(
      ticket.event_date
    ).toLocaleTimeString(
      'en-US',
      {
        hour: 'numeric',
        minute: '2-digit',
      }
    )}
  </p>
)}

  </div>

  <div className="ticketQRSection">

    <img
      src={ticket.qr_code}
      alt="QR Code"
      className="ticketQR"
    />

    <p className="ticketId">
      {ticket.ticket_id}
    </p>

  </div>

</div>

  ))}

</div>
        )}

      </div>

    </div>
  );
}